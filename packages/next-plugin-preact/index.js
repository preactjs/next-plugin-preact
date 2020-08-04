const { join } = require('path');
const moduleAlias = require('module-alias');

function npm(name) {
  return name;
}

moduleAlias.addAliases({
  react: npm('preact/compat'),
  'react-dom': npm('preact/compat'),
  'react-ssr-prepass': npm('preact-ssr-prepass'),
  webpack: npm('webpack')
});

// this has to come after the webpack alias is set up:
const withPrefresh = require('@prefresh/next');

validateDependencies();

module.exports = function withPreact(nextConfig = {}) {
  return withPrefresh(
    Object.assign({}, nextConfig, {
      webpack(config, options) {
        const { dev, isServer, defaultLoaders } = options;

        if (!defaultLoaders) {
          throw new Error(
            'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
          );
        }

        // Move Preact into the framework chunk instead of duplicating in routes:
        const splitChunks =
          config.optimization && config.optimization.splitChunks;
        if (splitChunks) {
          const cacheGroups = splitChunks.cacheGroups;
          const test = /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/;
          if (cacheGroups.framework) {
            cacheGroups.preact = Object.assign({}, cacheGroups.framework, {
              test
            });
            // if you want to merge the 2 small commons+framework chunks:
            // cacheGroups.commons.name = 'framework';
          }
        }

        // Install webpack aliases:
        const aliases = config.resolve.alias || (config.resolve.alias = {});
        aliases.react = aliases['react-dom'] = 'preact/compat';
        aliases['react-ssr-prepass'] = 'preact-ssr-prepass';

        // Automatically inject Preact DevTools:
        if (dev && !isServer) {
          const entry = config.entry;
          config.entry = function () {
            return entry().then(function (entries) {
              entries['main.js'] = ['preact/debug'].concat(
                entries['main.js'] || []
              );
              return entries;
            });
          };
        }

        if (typeof nextConfig.webpack === 'function') {
          config = nextConfig.webpack(config, options);
        }

        return config;
      }
    })
  );
};

function validateDependencies() {
  const toInstall = [];

  for (const dep of ['preact', 'preact-render-to-string']) {
    try {
      require.resolve(dep);
    } catch (e) {
      toInstall.push(dep);
    }
  }

  const NON_ALIAS_VERSION_REGEX = /^[\^~<>=\d]/;
  const pkg = require(join(process.cwd(), 'package.json'));
  const deps = pkg.dependencies;
  if (!deps || !deps.react || NON_ALIAS_VERSION_REGEX.test(deps.react)) {
    toInstall.push('react@npm:@preact/compat');
  }
  if (
    !deps ||
    !deps['react-dom'] ||
    NON_ALIAS_VERSION_REGEX.test(deps['react-dom'])
  ) {
    toInstall.push('react-dom@npm:@preact/compat');
  }

  if (toInstall.length) {
    console.error(
      `[preact] Missing/incorrect dependencies.\nPlease run:
    npm i --save ${toInstall.join(' ')}
    OR
    yarn add ${toInstall.join(' ')}`
    );
    process.exit(-1);
  }
}

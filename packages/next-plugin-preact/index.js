const { join } = require('path');
const moduleAlias = require('module-alias');
const esc = require('./esc');

moduleAlias.addAliases({
  react: 'preact/compat',
  'react-dom': 'preact/compat',
  'react-ssr-prepass': 'preact-ssr-prepass',
  webpack: 'webpack'
});

// this has to come after the webpack alias is set up:
const withPrefresh = require('@prefresh/next');

validateDependencies();

module.exports = function withPreact(nextConfig = {}) {
  return withPrefresh(
    Object.assign({}, nextConfig, {
      webpack(config, options) {
        const { dev, isServer, defaultLoaders } = options;

        // Disable package exports field resolution in webpack. It can lead
        // to dual package hazards where packages are imported twice: One
        // commonjs version and one ESM version. This breaks hooks which have
        // to rely on a singleton by design (nothing we can do about that).
        // See #25 and https://nodejs.org/dist/latest-v14.x/docs/api/esm.html#esm_dual_package_hazard
        // for more information.
        const webpackVersion = options.webpack.version;
        if (isServer && +webpackVersion.split('.')[0] >= 5) {
          config.resolve.exportsFields = [];
        }

        if (!defaultLoaders) {
          throw new Error(
            'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
          );
        }

        // Move Preact into the framework chunk instead of duplicating in routes:
        const splitChunks =
          config.optimization && config.optimization.splitChunks;
        if (splitChunks && splitChunks.cacheGroups) {
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

        // Automatically inject Preact DevTools
        if (dev) {
          const prependToEntry = isServer ? 'pages/_document' : 'main.js';

          const rtsVersion = require('preact-render-to-string/package.json')
            .version.split('.')
            .map(Number);
          // render to string <= 5.1.10 requires a monkey-patch to invoke preact.options._diff
          const requiresRTSDiffHookPatch =
            rtsVersion[0] < 5 ||
            (rtsVersion[0] === 5 &&
              (rtsVersion[1] < 1 ||
                (rtsVersion[1] === 1 && rtsVersion[2] <= 10)));

          const itemsToPrepend =
            isServer && requiresRTSDiffHookPatch
              ? [
                  'preact/debug',
                  'next-plugin-preact/patches/rts-invoke-diff-hook.js'
                ]
              : ['preact/debug'];

          if (isServer && requiresRTSDiffHookPatch) {
            process.stdout.write(
              `${esc('31;1m')}next-plugin-preact:${esc(
                '0m'
              )} The preact-render-to-string in use requires a monkey-patch for options._diff. Upgrade to preact-render-to-string > 5.1.10 once available!\n`
            );
          }

          const entry = config.entry;
          config.entry = function () {
            return entry().then(function (entries) {
              entries[prependToEntry] = itemsToPrepend.concat(
                entries[prependToEntry] || []
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
    const lines = '-'.repeat(Math.max(process.stdout.columns - 1, 10));
    console.error(`${lines}${esc('31;0m')}
[preact] Missing/incorrect dependencies.
Please run:
  npm i ${toInstall.join(' ')}

or:

  yarn add ${toInstall.join(' ')}
${lines}${esc('0m')}`);
    process.exit(-1);
  }
}

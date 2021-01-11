# Next.js plugin for preact X

## Installation

```sh
npm install --save next next-plugin-preact preact react@npm:@preact/compat react-dom@npm:@preact/compat react-ssr-prepass@npm:preact-ssr-prepass preact-render-to-string
```

or

```sh
yarn add next next-plugin-preact preact react@npm:@preact/compat react-dom@npm:@preact/compat react-ssr-prepass@npm:preact-ssr-prepass preact-render-to-string
```

## Usage

Create a next.config.js in your project and apply the plugin.

```js
// next.config.js
const withPreact = require('next-plugin-preact');

module.exports = withPreact({
    /* regular next.js config options here */
});
```

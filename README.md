# Next.js plugin for preact X

> This Next.js plugin is based on the awesome work done on the  [@zeit/next-preact](https://github.com/zeit/next-plugins/tree/master/packages/next-preact) plugin that did the same for preact < 10.

## Installation

```sh
npm install --save next-plugin-preact preact@next
```

or

```sh
yarn add next-plugin-preact preact@next
```

## Usage

Create a next.config.js in your project and apply the plugin. This 

```js
// next.config.js
const withPreact = require('next-plugin-preact');

module.exports = withPreact({
    /* regular next.js config options here */
}):
```

### Without custom server

Since we can not call module-alias soon enough when using the next cli we need to wrap it. To do so create a `script` entry in your `package.json`:

```json
    "scripts": {
        "next": "next-preact"
    }
```

You can then use `npm run next` or `yarn next` to invoke the next cli.

### With custom server

When using a customer server you'll need to alias things manually. Add the following snippet to the top of your entrypoint.

```js
require('next-plugin-preact/alias)();
```

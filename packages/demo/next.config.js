// next.config.js
const withPreact = require('next-plugin-preact');
const withCSS = require('@zeit/next-css');

module.exports = withCSS(
  withPreact({
    /* config options here */
  })
);

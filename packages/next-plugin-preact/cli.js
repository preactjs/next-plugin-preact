#!/usr/bin/env node
require("./alias")();

const JestWorker = require("jest-worker");

JestWorker.default = class CustomJestWorker extends JestWorker.default {
  constructor(workerPath, options) {
    super(
      workerPath,
      Object.assign({}, options, {
        forkOptions: Object.assign({}, options && options.forkOptions, {
          execArgv: [].concat(
            options && options.forkOptions && options.forkOptions.execArgv
              ? options.forkOptions.execArgv
              : process.execArgv.filter((v) => !/^--(debug|inspect)/.test(v)),
            [`--require=${require.resolve("next-plugin-preact/do-alias.js")}`]
          ),
        }),
      })
    );
  }
};

require("next/dist/bin/next");

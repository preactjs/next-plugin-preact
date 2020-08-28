const esc = require('./esc');
const lines = `\n${'-'.repeat(Math.max(process.stdout.columns - 1, 10))}\n`;

process.stdout.write(
  `${esc('1A')}${esc('K')}${lines}
${esc('35;1m')}[PREACT] Required manual step!${esc('0m')}

${esc('36;1m')}Install the alias packages:
${esc('0m')}

  npm i --save react@npm:@preact/compat react-dom@npm:@preact/compat

or:

  yarn add react@npm:@preact/compat react-dom@npm:@preact/compat
${lines}
`
);

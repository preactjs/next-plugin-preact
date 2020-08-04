const lines = `\n${'-'.repeat(Math.max(process.stdout.columns - 1, 10))}\n`;
const esc =
  process.stdout.hasColors && process.stdout.hasColors()
    ? n => `\x1b[${n}`
    : () => '';
process.stdout.write(
  `${esc('1A')}${esc('K')}${lines}` +
    `${esc('35;1m')}[PREACT] Required manual step!${esc('0m')}\n` +
    `${esc('36;1m')}Install the alias packages:\n$${esc('0m')}\n` +
    `  npm i --save react@npm:@preact/compat react-dom@npm:@preact/compat\n` +
    `  OR:\n` +
    `  yarn add react@npm:@preact/compat react-dom@npm:@preact/compat` +
    lines
);

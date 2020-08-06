module.exports =
  process.stdout.hasColors && process.stdout.hasColors()
    ? n => `\x1b[${n}`
    : () => '';

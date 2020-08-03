const moduleAlias = require("module-alias");

module.exports = () => {
  console.log("==== alias in process", process.pid);
  const renderToString = require("preact-render-to-string");
  if (!renderToString.renderToStaticMarkup) {
    renderToString.renderToStaticMarkup = renderToString;
  }
  moduleAlias.addAlias("react", "preact/compat");
  moduleAlias.addAlias("react-dom", "preact/compat");
  moduleAlias.addAlias("react-ssr-prepass", "preact-ssr-prepass");
};

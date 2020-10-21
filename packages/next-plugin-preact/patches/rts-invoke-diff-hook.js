const { options } = require('preact');
const oldRender = options.__r;

options.__r = function (vnode) {
  options.__b(vnode);
  return oldRender(vnode);
};

module.exports = {
  path: '/@cfdi/xml',
  name: '@cfdi/xml',
  test() {
    const pkg = require('@cfdi/xml');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

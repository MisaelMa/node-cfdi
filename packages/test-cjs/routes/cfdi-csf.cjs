module.exports = {
  path: '/@cfdi/csf',
  name: '@cfdi/csf',
  test() {
    const pkg = require('@cfdi/csf');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

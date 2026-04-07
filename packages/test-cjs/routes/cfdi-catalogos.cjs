module.exports = {
  path: '/@cfdi/catalogos',
  name: '@cfdi/catalogos',
  test() {
    const pkg = require('@cfdi/catalogos');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

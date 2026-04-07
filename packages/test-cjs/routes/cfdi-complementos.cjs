module.exports = {
  path: '/@cfdi/complementos',
  name: '@cfdi/complementos',
  test() {
    const pkg = require('@cfdi/complementos');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

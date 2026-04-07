module.exports = {
  path: '/@cfdi/expresiones',
  name: '@cfdi/expresiones',
  test() {
    const pkg = require('@cfdi/expresiones');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

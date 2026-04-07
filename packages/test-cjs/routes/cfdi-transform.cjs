module.exports = {
  path: '/@cfdi/transform',
  name: '@cfdi/transform',
  test() {
    const pkg = require('@cfdi/transform');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

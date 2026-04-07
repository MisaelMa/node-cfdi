module.exports = {
  path: '/@cfdi/types',
  name: '@cfdi/types',
  test() {
    const pkg = require('@cfdi/types');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

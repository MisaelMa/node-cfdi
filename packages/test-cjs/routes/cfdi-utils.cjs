module.exports = {
  path: '/@cfdi/utils',
  name: '@cfdi/utils',
  test() {
    const pkg = require('@cfdi/utils');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

module.exports = {
  path: '/@cfdi/csd',
  name: '@cfdi/csd',
  test() {
    const pkg = require('@cfdi/csd');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

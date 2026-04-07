module.exports = {
  path: '/@cfdi/2json',
  name: '@cfdi/2json',
  test() {
    const pkg = require('@cfdi/2json');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

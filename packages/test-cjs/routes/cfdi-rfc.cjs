module.exports = {
  path: '/@cfdi/rfc',
  name: '@cfdi/rfc',
  test() {
    const pkg = require('@cfdi/rfc');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

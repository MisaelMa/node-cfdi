module.exports = {
  path: '/@cfdi/elements',
  name: '@cfdi/elements',
  test() {
    const pkg = require('@cfdi/elements');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

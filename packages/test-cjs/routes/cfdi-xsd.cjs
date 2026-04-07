module.exports = {
  path: '/@cfdi/xsd',
  name: '@cfdi/xsd',
  test() {
    const pkg = require('@cfdi/xsd');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

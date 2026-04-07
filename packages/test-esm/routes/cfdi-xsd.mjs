export default {
  path: '/@cfdi/xsd',
  name: '@cfdi/xsd',
  async test() {
    const pkg = await import('@cfdi/xsd');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

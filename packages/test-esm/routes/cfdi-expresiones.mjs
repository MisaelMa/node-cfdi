export default {
  path: '/@cfdi/expresiones',
  name: '@cfdi/expresiones',
  async test() {
    const pkg = await import('@cfdi/expresiones');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

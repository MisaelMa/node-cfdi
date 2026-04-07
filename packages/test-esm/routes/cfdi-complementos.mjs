export default {
  path: '/@cfdi/complementos',
  name: '@cfdi/complementos',
  async test() {
    const pkg = await import('@cfdi/complementos');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

export default {
  path: '/@cfdi/catalogos',
  name: '@cfdi/catalogos',
  async test() {
    const pkg = await import('@cfdi/catalogos');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

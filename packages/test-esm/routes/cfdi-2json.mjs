export default {
  path: '/@cfdi/2json',
  name: '@cfdi/2json',
  async test() {
    const pkg = await import('@cfdi/2json');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

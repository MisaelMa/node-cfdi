export default {
  path: '/@cfdi/types',
  name: '@cfdi/types',
  async test() {
    const pkg = await import('@cfdi/types');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

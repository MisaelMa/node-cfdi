export default {
  path: '/@cfdi/transform',
  name: '@cfdi/transform',
  async test() {
    const pkg = await import('@cfdi/transform');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

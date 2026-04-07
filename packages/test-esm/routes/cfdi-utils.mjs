export default {
  path: '/@cfdi/utils',
  name: '@cfdi/utils',
  async test() {
    const pkg = await import('@cfdi/utils');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

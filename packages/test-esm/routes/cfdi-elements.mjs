export default {
  path: '/@cfdi/elements',
  name: '@cfdi/elements',
  async test() {
    const pkg = await import('@cfdi/elements');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

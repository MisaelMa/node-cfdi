export default {
  path: '/@cfdi/csd',
  name: '@cfdi/csd',
  async test() {
    const pkg = await import('@cfdi/csd');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

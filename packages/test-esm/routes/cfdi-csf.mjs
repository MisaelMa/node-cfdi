export default {
  path: '/@cfdi/csf',
  name: '@cfdi/csf',
  async test() {
    const pkg = await import('@cfdi/csf');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

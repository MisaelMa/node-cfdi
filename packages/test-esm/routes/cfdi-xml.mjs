export default {
  path: '/@cfdi/xml',
  name: '@cfdi/xml',
  async test() {
    const pkg = await import('@cfdi/xml');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

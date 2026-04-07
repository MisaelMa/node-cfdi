export default {
  path: '/@cfdi/rfc',
  name: '@cfdi/rfc',
  async test() {
    const pkg = await import('@cfdi/rfc');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

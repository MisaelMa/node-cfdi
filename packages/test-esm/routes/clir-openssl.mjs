export default {
  path: '/@clir/openssl',
  name: '@clir/openssl',
  async test() {
    const pkg = await import('@clir/openssl');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

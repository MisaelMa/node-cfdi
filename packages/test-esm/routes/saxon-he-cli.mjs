export default {
  path: '/@saxon-he/cli',
  name: '@saxon-he/cli',
  async test() {
    const pkg = await import('@saxon-he/cli');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

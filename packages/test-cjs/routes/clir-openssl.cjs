module.exports = {
  path: '/@clir/openssl',
  name: '@clir/openssl',
  test() {
    const pkg = require('@clir/openssl');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

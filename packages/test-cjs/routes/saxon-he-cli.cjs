module.exports = {
  path: '/@saxon-he/cli',
  name: '@saxon-he/cli',
  test() {
    const pkg = require('@saxon-he/cli');
    const exports = Object.keys(pkg);
    return { exports };
  },
};

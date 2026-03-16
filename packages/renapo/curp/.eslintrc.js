// This is a workaround for https://github.com/eslint/eslint/issues/3458
require("@rushstack/eslint-config/patch/modern-module-resolution");

module.exports = {
  extends: [
    "./node_modules/@recreando/eslint-settings/react",
  ],
  parserOptions: { tsconfigRootDir: __dirname, },
  rules: {
    "no-unused-expressions": "off",
    "sort-imports": "off",
    "no-unused-vars": "off",
    "import/no-cycle": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "varsIgnorePattern": "React" }],
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-argument":"off",
    "@typescript-eslint/await-thenable": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "no-async-promise-executor":"off",
    "noUnusedLocals": "off",
    "no-unused-vars": "off",
    "noUnusedParameters": "off",
    "no-unused-variable":1,
    "class-methods-use-this":"off",
    "react/no-multi-comp": "off",
    "guard-for-in": "off",
    "no-restricted-syntax":"off"
  },
};

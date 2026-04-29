require("@rushstack/eslint-config/patch/modern-module-resolution");

module.exports = {
  extends: [
    "./node_modules/@recreando/eslint-settings/react",
  ],
  parserOptions: { tsconfigRootDir: __dirname },
  rules: {
    "no-unused-expressions": "off",
    "sort-imports": "off",
    "no-unused-vars": "off",
    "import/no-cycle": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "class-methods-use-this": "off",
    "guard-for-in": "off",
    "no-restricted-syntax": "off"
  },
};

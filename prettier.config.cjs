/** @type {import('prettier').Config} */
module.exports = {
  endOfLine: "auto",
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "es5",
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ["typescript", "decorators-legacy"],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
  pluginSearchDirs: false,
};

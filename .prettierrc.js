module.exports = {
  ...require("mwts/.prettierrc.json"),
  arrowParens: "always", // 箭头函数，只有一个参数的时候，也需要括号
  bracketSpacing: true, // 大括号内的首尾需要空格
  endOfLine: "lf", // 换行符使用 lf
  htmlWhitespaceSensitivity: "css", // 根据显示样式决定 html 要不要折行
  insertPragma: false, // 不需要自动在文件开头插入 @prettier
  jsxSingleQuote: false, // jsx 不使用单引号，而使用双引号
  printWidth: 120, // 一行最多 120 字符
  proseWrap: "preserve", // 使用默认的折行标准
  quoteProps: "consistent", // 对象的 key 引号使用相同的风格
  rangeEnd: Infinity, // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  requirePragma: false, // 不需要写文件开头的 @prettier
  semi: true, // 行尾需要有分号
  singleQuote: true, // 使用单引号
  tabWidth: 2, // 使用 2 个空格缩进
  trailingComma: "all", // 末尾需要有逗号
  useTabs: false, // 不使用缩进符，而使用空格
  vueIndentScriptAndStyle: false // vue 文件中的 script 和 style 内不用缩进
};

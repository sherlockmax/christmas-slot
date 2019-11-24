module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'plugin:prettier/recommended', '@vue/prettier', 'plugin:vue/recommended'],
  plugins: ['vue', 'prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': [
      'error',
      {
        useTabs: false,
        printWidth: 120,
        tabWidth: 2,
        singleQuote: true,
        semi: false,
        arrowParens: 'always'
      }
    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}

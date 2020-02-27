/*
 * @Author: your name
 * @Date: 2020-02-12 15:21:02
 * @LastEditTime: 2020-02-27 16:33:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\babel.config.js
 */
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布产品时的数组，用于生产环境
    ...prodPlugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}

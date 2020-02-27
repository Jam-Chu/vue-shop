/*
 * @Author: your name
 * @Date: 2020-02-27 13:03:01
 * @LastEditTime: 2020-02-27 16:46:12
 * @LastEditors: Please set LastEditors
 * @Description: 编译模式控制
 * @FilePath: \vue_shop\vue.config.js
 */
// webpack打包的自定义配置
module.exports = {
  chainWebpack: config => {
    //   process.env.NODE_ENV可以取得当前状态下的编译模式，发布模式save
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'Nprogress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    // 开发模式development
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}

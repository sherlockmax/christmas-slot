module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('pug')
      .test(/\.pug$/)
      .use('pug-html-loader')
      .loader('pug-html-loader')
      .end()
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: 'ChristmasSlot',
        appId: 'com.chungyo.rd2',
        mac: {
          icon: './src/assets/logo.png',
          target: ['dmg']
        }
      }
    }
  }
}

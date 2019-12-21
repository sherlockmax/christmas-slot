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
        appId: 'self.sherlock.max',
        mac: {
          icon: './src/assets/logo.png',
          target: ['dmg']
        }
      }
    }
  }
}

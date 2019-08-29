const path = require('path')

module.exports = {
  chainWebpack: config => {
    const apiClient = typeof process.env.VUE_APP_API_CLIENT !== 'undefined'
      ? process.env.VUE_APP_API_CLIENT
      : 'mock'
    
    config.resolve.alias.set(
      'api',
      path.resolve(__dirname, `src/api/${apiClient}`)
    )

    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader')
      .end()
  }
}
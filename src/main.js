import Vue from 'vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import './filters'
import App from './App'

import Console from '@/utils/Console'

window._APP_VERSION = '1.2.2'

Console.LEVEL = Console.LEVEL_LOG

Vue.config.productionTip = false

require('@/assets/css/w3.css')
require('@/assets/css/w3-theme.css')

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')

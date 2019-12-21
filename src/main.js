import Vue from 'vue'
import App from './App.vue'
import router from './router'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
// import 'bootstrap' // Import js file
import './assets/css/main.scss'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faExpand, faCompress, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faExpand, faCompress, faTimes)
Vue.component('font-awesome-icon', FontAwesomeIcon)

import VueLodash from 'vue-lodash'
const options = { name: 'lodash' } // customize the way you want to call it
Vue.use(VueLodash, options) // options is optional

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')

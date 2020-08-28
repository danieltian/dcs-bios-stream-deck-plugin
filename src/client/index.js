import Vue from 'vue'
import App from './App.vue'
import plugin from './plugin'

Vue.prototype.$plugin = plugin
Vue.prototype.$eventBus = new Vue()

new Vue({
  el: '#app',
  render: (h) => h(App),
})

import Vue from 'vue'
import App from './App.vue'
import plugin from './plugin'

Vue.prototype.$plugin = plugin

new Vue({
  el: '#app',
  render: (h) => h(App),
})

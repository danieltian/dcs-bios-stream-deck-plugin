import Vue from 'vue'
import VueKonva from 'vue-konva'
import App from './App.vue'
import plugin from './plugin'
import controlPicker from './controlPicker'

Vue.use(VueKonva)

Vue.prototype.$plugin = plugin
Vue.prototype.$controlPicker = controlPicker

new Vue({
  el: '#app',
  render: (h) => h(App),
})

import Vue from 'vue'
import VueKonva from 'vue-konva'
import App from './App.vue'
import plugin from './plugin'
import controlPickerEventBus from './controlPickerEventBus'

Vue.use(VueKonva)

Vue.prototype.$plugin = plugin
Vue.prototype.$controlPickerEventBus = controlPickerEventBus

new Vue({
  el: '#app',
  render: (h) => h(App),
})

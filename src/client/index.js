import Vue from 'vue'
import VueKonva from 'vue-konva'
import App from './App.vue'
import plugin from './plugin'
import eventBus from './eventBus'
import path from 'path'

Vue.use(VueKonva)

Vue.prototype.$plugin = plugin
Vue.prototype.$eventBus = eventBus

const requireComponent = require.context('./components')
// Add all the shared components globally so we don't have to import them everywhere they're used.
requireComponent.keys().forEach((filePath) => {
  const componentConfig = requireComponent(filePath)
  const componentName = path.basename(filePath, '.vue')

  Vue.component(componentName, componentConfig.default)
})

new Vue({
  el: '#app',
  render: (h) => h(App),
})

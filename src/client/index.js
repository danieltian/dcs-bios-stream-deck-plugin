import path from 'path'
import Vue from 'vue'
import App from '@components/App.vue'

const requireComponent = require.context('./components/shared')
// Add all the shared components globally so we don't have to import them everywhere they're used.
requireComponent.keys().forEach(filePath => {
  const componentConfig = requireComponent(filePath)
  const componentName = path.basename(filePath, '.vue')

  Vue.component(componentName, componentConfig.default)
})

new Vue({
  el: '#app',
  render: h => h(App)
})

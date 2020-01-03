import Vue, { VNode } from 'vue'
import VueObserveVisibility from 'vue-observe-visibility'
import App from '@components/App.vue'

Vue.use(VueObserveVisibility)

new Vue({
  el: '#app',
  render: (h): VNode => h(App)
})

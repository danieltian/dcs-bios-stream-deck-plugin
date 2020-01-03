<template lang="pug">
  #app
    h1 Hello from app!
    ControlPicker
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import ControlPicker from '@components/ControlPicker/ControlPicker.vue'

  @Component({ components: { ControlPicker } })
  export default class App extends Vue {}
</script>

<style lang="stylus">
  @import '~@mdi/font/css/materialdesignicons.min.css'
  @require '../styles/global'

  body
    margin: 0
    background-color: $color-background
    color: $color-text
    font-family: Trebuchet MS, roboto, ubuntu, sans-serif
    user-select: none
</style>

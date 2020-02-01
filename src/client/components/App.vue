<template lang="pug">
  #app
    h1 Hello from app!
    //- ControlPicker
    ImageEditor
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import ControlPicker from '@components/ControlPicker/ControlPicker.vue'
  import ImageEditor from '@components/ImageEditor/ImageEditor.vue'

  @Component({ components: { ControlPicker, ImageEditor } })
  export default class App extends Vue {}
</script>

<style lang="stylus">
  @import '~@mdi/font/css/materialdesignicons.min.css'

  body
    margin: 0
    background-color: $color-background
    color: $color-text
    font-family: Trebuchet MS, roboto, ubuntu, sans-serif
    user-select: none
</style>

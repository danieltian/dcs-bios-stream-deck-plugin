<template lang="pug">
  #app
    h1 Hello from app!
    //- ControlPicker
    ImageEditor
</template>

<script>
  import ControlPicker from '@components/ControlPicker/ControlPicker.vue'
  import ImageEditor from '@components/ImageEditor/ImageEditor.vue'

  export default {
    components: { ControlPicker, ImageEditor },
  }
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

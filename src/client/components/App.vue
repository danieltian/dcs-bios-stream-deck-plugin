<template lang="pug">
  #app
    h1 Hello from app!
    span.mdi.mdi-home
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  @Component
  export default class App extends Vue {}
</script>

<style lang="stylus">
  @import '~@mdi/font/css/materialdesignicons.css'

  body
    background-color: $color-background
    color: $color-text
    font-family: Trebuchet MS, roboto, ubuntu, sans-serif
    margin: 0
    user-select: none
</style>

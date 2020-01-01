<template lang="pug">
  h1 Hello from app! {{ message }}
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  @Component
  export default class App extends Vue {
    message = 'message'

    testIf() {
      if (this.message) {
        return 'ok'
      } else {
        return 'no'
      }
    }
  }
</script>

<style lang="stylus">
  h1
    color: red
</style>

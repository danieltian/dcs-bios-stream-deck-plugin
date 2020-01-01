<template lang="pug">
  Button(text="Button Text") Hello!
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import Button from './Button.vue'

  @Component({ components: { Button } })
  export default class Shared extends Vue {}
</script>

<style lang="stylus" scoped></style>

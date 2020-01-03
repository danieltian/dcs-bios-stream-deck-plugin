<template lang="pug">
  button {{ text }}
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'

  @Component
  export default class Button extends Vue {
    @Prop() readonly text!: string
  }
</script>

<style lang="stylus" scoped>
  button
    padding: 0.4em 1em
    outline: none
    border: none
    border-radius: 4px
    background-color: $color-button-background
    color: white
    font-size: 0.9em

    &:hover
      background-color: $color-button-background-hover
</style>

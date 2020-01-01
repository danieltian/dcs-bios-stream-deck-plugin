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
    color: white
    background-color: $color-button-background
    border: none
    outline: none
    font-size: 0.9em
    padding: 0.4em 1em
    border-radius: 4px
    cursor: pointer

    &:hover
      background-color: $color-button-background-hover
</style>

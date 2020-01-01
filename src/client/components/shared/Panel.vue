<template lang="pug">
  .panel
    .title
      .title-text {{ title }}
      .mdi.mdi-close.close-icon

    .body
      slot
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'

  @Component
  export default class Button extends Vue {
    @Prop() readonly title!: string
  }
</script>

<style lang="stylus" scoped>
  .panel
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    background-color: $color-background

  .title
    flexCenter()
    padding: 0.3em 0.2em 0.3em 0.5em
    text-transform: uppercase
    border-bottom: 1px solid $color-border

    .title-text
      flex: 1

    .close-icon
      flexBoth()
      padding: 0.4em
      cursor: pointer

      &:hover
        filter: brightness(1.5)

      &:active
        filter: brightness(0.5)
</style>

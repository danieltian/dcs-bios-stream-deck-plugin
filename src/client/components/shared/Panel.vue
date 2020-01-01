<template lang="pug">
  .panel
    .title
      .title-text {{ title }}
      span.mdi.mdi-close.close-icon

    .body
      slot
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'

  @Component
  export default class Panel extends Vue {
    @Prop() readonly title!: string
  }
</script>

<style lang="stylus" scoped>
  .panel
    background-color: $color-background
    border: 1px solid $color-border
    box-shadow: 1px 1px 4px 2px black

  .title
    flexCenter()
    padding: 0.3em 0.2em 0.3em 0.5em
    text-transform: uppercase
    border-bottom: 1px solid $color-border

    .title-text
      flex: 1

    .close-icon
      padding: 0.4em
      cursor: pointer

      &:hover
        filter: brightness(1.5)

      &:active
        filter: brightness(0.5)
</style>

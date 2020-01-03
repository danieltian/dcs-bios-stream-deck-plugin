<template lang="pug">
  .panel
    .title
      .title-text {{ title }}
      Icon.close-icon(icon="close")

    .body
      slot
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'
  import Icon from '@shared/Icon.vue'

  @Component({ components: { Icon } })
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
    display: grid
    grid-template-columns: 1fr min-content
    align-items: center
    text-transform: uppercase
    border-bottom: 1px solid $color-border

    .title-text
      font-size: 0.9em
      padding-left: 0.7em

    .close-icon
      padding: 0.7em
</style>

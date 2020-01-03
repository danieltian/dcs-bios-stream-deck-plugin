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
    display: grid
    border: 1px solid $color-border
    background-color: $color-background
    box-shadow: 1px 1px 4px 2px black
    grid-template-rows: min-content 1fr

  .title
    display: grid
    align-items: center
    border-bottom: 1px solid $color-border
    text-transform: uppercase
    grid-template-columns: 1fr min-content

    .title-text
      padding-left: 0.7em
      font-size: 0.9em

    .close-icon
      padding: 0.7em
</style>

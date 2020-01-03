<template lang="pug">
  .panel
    .title
      .title-text {{ title }}
      Icon.close-icon(icon="close")

    slot(name="topbar")

    .body
      slot

    slot(name="bottombar")
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
    display: flex
    flex-direction: column
    border: 1px solid $color-border
    background-color: $color-dropdown-background
    box-shadow: 1px 1px 4px 2px black

  .title
    display: flex
    align-items: center
    border-bottom: 1px solid $color-border
    text-transform: uppercase

    .title-text
      flex: 1
      padding-left: 0.7em
      font-size: 0.9em

    .close-icon
      padding: 0.7em

  .body
    scrollbar($color-dropdown-background)
    overflow-y: auto
</style>

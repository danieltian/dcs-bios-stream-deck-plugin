<template lang="pug">
  .panel
    .title
      .title-text {{ title }}
      Icon.close-icon(icon="close")

    slot(name="topBar")

    .body
      slot

    slot(name="bottomBar")
</template>

<script>
  export default {
    props: {
      title: { type: String, required: true },
    },
  }
</script>

<style lang="stylus" scoped>
  $margin = 2em

  .panel
    position: fixed
    top: $margin
    right: $margin
    bottom: $margin
    left: $margin
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

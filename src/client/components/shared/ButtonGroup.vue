<template lang="pug">
  .button-group
    .button(v-for="option in options" :class="{ selected: value == option }" @click="onClick(option)") {{ option }}
</template>

<script>
  export default {
    props: {
      options: { type: Array, required: true },
      value: { type: String, required: true }
    },

    methods: {
      onClick(option) {
        this.$emit('input', option)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  $border-radius = 3px
  $selected-color = #2196f3

  .button-group
    display: flex
    color: #758696

  .button
    margin-right: -1px
    padding: 0.5em 1.2em
    border: 1px solid #363c4e
    cursor: pointer

    &:hover
      z-index: 1
      border: 1px solid $selected-color
      color: $selected-color

    &:first-of-type
      border-top-left-radius: $border-radius
      border-bottom-left-radius: $border-radius

    &:last-of-type
      border-top-right-radius: $border-radius
      border-bottom-right-radius: $border-radius

    &.selected
      z-index: 1
      border: 1px solid $selected-color
      background-color: $selected-color
      color: #e1ecf2
</style>

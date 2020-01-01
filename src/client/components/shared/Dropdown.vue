<template lang="pug">
  .dropdown(tabindex="0" @blur="onBlur")
    .current(@click="toggleDropdown")
      .current-text {{ selected }}
      span.mdi.mdi-chevron-down.dropdown-icon

    .options(v-show="isDropdownOpen")
      .option(v-for="value in values" @click="onOptionClick(value)" :class="{ selected: value == selected }") {{ value }}
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'

  @Component
  export default class Dropdown extends Vue {
    @Prop() readonly values!: string[]
    @Prop() readonly selected!: string

    isDropdownOpen = false

    toggleDropdown(): void {
      this.isDropdownOpen = !this.isDropdownOpen
    }

    onOptionClick(value: string): void {
      this.$emit('change', value)
      this.isDropdownOpen = false
    }

    onBlur(): void {
      this.isDropdownOpen = false
    }
  }
</script>

<style lang="stylus" scoped>
  $item-padding = 0.2em 0.3em 0.2em 0.5em

  .dropdown
    position: relative
    outline: none

  // Currently-selected item.
  .current
    flexCenter()
    cursor: pointer

    &:hover
      color: white

    .current-text
      flex: 1
      padding: $item-padding
      padding-right: 0

    .dropdown-icon
      font-size: 1.3em
      padding-right: 0.3em

  // Dropdown items.
  .options
    position: absolute
    top: 0
    left: 0
    background-color: $color-dropdown-background
    width: 100%
    max-height: 90vh
    box-shadow: 1px 1px 10px 0px black

  .option
    padding: $item-padding
    cursor: pointer

    &:hover
      color: white
      background-color: $color-dropdown-background-hover

    &.selected
      color: white
      background-color: $color-dropdown-background-selected
</style>

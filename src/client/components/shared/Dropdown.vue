<template lang="pug">
  .dropdown(tabindex="0" @blur="onBlur")
    .current(@click="toggleDropdown")
      .current-text {{ selected }}
      Icon.dropdown-icon(icon="chevron-down" :clickable="false")

    .overlay(@click="onBlur" v-show="isDropdownOpen")
    .options(v-show="isDropdownOpen" :class="{ upwards: openUpwards }" :style="{ maxHeight: `${maxHeight}px` }")
      .option(v-for="value in values" @click="onOptionClick(value)" :class="{ selected: value == selected }") {{ value }}
</template>

<script>
  const minimumHeight = 150 // Minimum height of the dropdown.
  // How much margin to leave around the viewport so that the dropdown doesn't touch the edge of the viewport. We use a
  // percent here so that the smaller the viewport, the less margin there is.
  const viewportMarginPercent = 0.1

  export default {
    props: {
      values: { type: Array, required: true },
      selected: { type: String, required: true }
    },

    data: () => ({
      isDropdownOpen: false,
      openUpwards: false,
      maxHeight: 0
    }),

    watch: {
      isDropdownOpen() {
        if (!this.isDropdownOpen) return

        const rect = this.$el.getBoundingClientRect()
        const viewportMargin = window.innerHeight * viewportMarginPercent
        // Check to see if there's enough space for the dropdown to open downwards.
        this.openUpwards = window.innerHeight - rect.top - minimumHeight - viewportMargin < 0
        // Get the remaining space from the currently-selected item to the edge of the viewport. If we're opening
        // upwards, get the space from the top of the viewport to the bottom of the item, and if we're opening
        // downwards, get the space from the top of the item to the bottom of the viewport.
        const remainingSpace = this.openUpwards ? window.innerHeight - rect.bottom : rect.top
        this.maxHeight = Math.round(window.innerHeight - remainingSpace - viewportMargin)
      }
    },

    methods: {
      toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen
      },

      onOptionClick(value) {
        this.$emit('change', value)
        this.onBlur()
      },

      onBlur() {
        this.isDropdownOpen = false
      }
    }
  }
</script>

<style lang="stylus" scoped>
  $item-padding = 0.3em 0.3em 0.4em 0.5em

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
      white-space: nowrap

    .dropdown-icon
      padding-right: 0.3em
      font-size: 1.3em

  // Dropdown items.
  .options
    scrollbar()
    position: absolute
    top: 0
    left: 0
    z-index: 1
    overflow: auto
    width: 100%
    background-color: $color-dropdown-background
    box-shadow: 1px 1px 10px 0 black

    &.upwards
      top: unset
      bottom: 0

  .option
    padding: $item-padding
    cursor: pointer

    &:hover
      background-color: $color-dropdown-background-hover
      color: white

    &.selected
      background-color: $color-dropdown-background-selected
      color: white

  .overlay
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
</style>

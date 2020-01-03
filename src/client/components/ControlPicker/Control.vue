<template lang="pug">
  .control(@click="onClick")
    .name
      | {{ control.description }}
      span(v-if="control.suffix" style="color: yellow") {{ control.suffix }}
    .category
      .category-name {{ control.category }}
      .control-type(:class="color") {{ controlType }}

    .control-value {{ control.value }}
</template>

<script lang="ts">
  import { ClientControl } from '@/types'
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class ControlComponent extends Vue {
    @Prop() readonly control!: ClientControl

    isVisible = false

    get controlType(): string {
      const type = this.control.type.replace(/_/g, ' ')
      return type
    }

    get color(): string {
      switch (this.controlType) {
        case 'toggle switch':
          return 'red'
        case 'push button':
          return 'green'
        case 'limited rotary':
          return 'yellow'
        case 'rocker switch':
          return 'orange'
        case 'analog gauge':
          return 'blue'
        case 'limited dial':
          return 'brown'
        case 'infinite rotary':
          return 'olive'
        case 'variable step dial':
          return 'purple'
        case 'discrete dial':
          return 'violet'
        case 'display':
          return 'pink'
        case 'led':
          return 'teal'
        default:
          return 'gray'
      }
    }

    onClick(): void {
      this.$emit('click')
    }

    onVisibilityChanged(isVisible: boolean): void {
      this.isVisible = isVisible
    }
  }
</script>

<style lang="stylus" scoped>
  .control
    display: flex
    flex-direction: column
    align-content: center
    padding: 0 0.5em
    height: 42px
    cursor: pointer

    &:hover
      background-color: #2a2e39
      color: white

      .category
        filter: brightness(1.3)

    &.selected
      background-color: #d8d8d8
      color: black

  .name
    overflow: hidden
    margin: 0 0 0.5em
    margin-right: 0.5em
    text-transform: uppercase
    text-overflow: ellipsis
    white-space: nowrap

  .category
    display: flex
    margin-top: 0.1em
    color: #8c8c8c
    font-size: 0.7em

  .category-name
    margin-right: 1em

  .control-type
    text-transform: uppercase

    &.red
      color: #bc3838

    &.orange
      color: #d6793b

    &.yellow
      color: #b38d1d

    &.blue
      color: #2185d0

    &.green
      color: #4ab037

    &.pink
      color: #ba4286

    &.teal
      color: #1db8b1

    &.olive
      color: #8b9c15

    &.brown
      color: #a5673f

    &.purple
      color: #6b018e

    &.pink
      color: #e03997

    &.violet
      color: #6c4bb1

    &.gray
      color: #767676

  .control-value
    grid-row: 1 / 3
    grid-column: 2
</style>

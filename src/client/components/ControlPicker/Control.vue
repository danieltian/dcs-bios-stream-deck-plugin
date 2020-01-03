<template lang="pug">
  .control(@click="onClick")
    .name
      | {{ control.description }}
      span.suffix {{ control.suffix }}
    .category
      | {{ control.category }}
      span.control-type(:class="color") {{ controlType }}
</template>

<script lang="ts">
  import { ClientControl } from '@/types'
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class ControlComponent extends Vue {
    @Prop() readonly control!: ClientControl

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

    onClick(e: Event): void {
      this.$emit('click', e)
    }
  }
</script>

<style lang="stylus" scoped>
  .control
    padding: 0.3em 0.5em
    cursor: pointer

    &:hover
      background-color: $color-dropdown-background-hover
      color: white

      .category
        filter: brightness(1.3)

  .name
    truncate()
    text-transform: uppercase

  .suffix
    color: yellow

  .category
    margin-top: 0.2em
    color: #787b86
    font-size: 0.7em

  .control-type
    margin-left: 1em
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
</style>

<template lang="pug">
  span.mdi(:class="classNames" @click="onClick")
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'

  @Component
  export default class Icon extends Vue {
    @Prop() icon!: string
    @Prop({ default: true }) clickable!: string

    get classNames(): string {
      const classNames = [`mdi-${this.icon}`]

      if (this.clickable) {
        classNames.push('clickable')
      }

      return classNames.join(' ')
    }

    onClick(e: Event): void {
      if (this.clickable) {
        this.$emit('click', e)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .mdi
    display: grid
    align-items: center

    &.clickable
      opacity: 0.5
      color: $color-text
      cursor: pointer

      &:hover
        opacity: 1

      &:active
        opacity: 0.25
</style>

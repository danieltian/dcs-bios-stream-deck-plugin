<template lang="pug">
  .search(:class="{ focus: isFocused }" @click="setFocus(true)")
    Icon.search-icon(icon="magnify" :clickable="false")
    input.input(:value="value" ref="input" @input="onInput" @blur="setFocus(false)")
    Icon.close-icon(icon="close" @click="clear" v-show="value")
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'
  import Icon from '@shared/Icon.vue'

  @Component({ components: { Icon } })
  export default class Search extends Vue {
    @Prop() readonly value!: string

    isFocused = false

    onInput(e: Event): void {
      this.$emit('input', (e.target as HTMLInputElement).value)
    }

    clear(): void {
      this.$emit('input', '')
    }

    setFocus(isFocused: boolean): void {
      if (isFocused) {
        ;(this.$refs.input as HTMLInputElement).focus()
      }

      this.isFocused = isFocused
    }
  }
</script>

<style lang="stylus" scoped>
  .search
    display: grid
    grid-template-columns: min-content 1fr min-content
    padding-left: 0.3em
    cursor: text

  .search-icon
    opacity: 0.5

  .input
    padding: 0 0 0 0.2em
    background: none
    border: none
    outline: none
    color: #c5cbce
    font-size: 1em

  .close-icon
    font-size: 0.9em
    padding: 0 0.53em
</style>

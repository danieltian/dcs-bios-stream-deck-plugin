<template lang="pug">
  .search(@click="onFocus")
    Icon.search-icon(icon="magnify" :clickable="false")
    input.input(:value="value" ref="input" @input="onInput")
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

    onFocus(): void {
      ;(this.$refs.input as HTMLInputElement).focus()
      this.isFocused = true
    }

    clear(): void {
      this.$emit('input', '')
    }
  }
</script>

<style lang="stylus" scoped>
  .search
    flexCenter()
    flex: 1
    padding-left: 0.3em
    cursor: text

  .search-icon
    opacity: 0.5

  .input
    flex: 1
    padding: 0 0 0 0.2em
    outline: none
    border: none
    background: none
    color: #c5cbce
    font-size: 1em

  .close-icon
    padding: 0 0.53em
    font-size: 0.9em
</style>

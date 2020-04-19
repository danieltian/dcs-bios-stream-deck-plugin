<template lang="pug">
  .search(@click="onFocus")
    Icon.search-icon(icon="magnify" :clickable="false")
    input.input(:value="value" ref="input" spellcheck="false" @input="onInput")
    Icon.close-icon(icon="close" @click="clear" v-show="value")
</template>

<script>
  export default {
    props: {
      value: { type: String, default: '' },
    },

    data: () => ({
      isFocused: false,
    }),

    methods: {
      onInput(e) {
        this.$emit('input', e.target.value)
      },

      onFocus() {
        this.$refs.input.focus()
        this.isFocused = true
      },

      clear() {
        this.$emit('input', '')
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .search
    flexCenter()
    flex: 1
    padding-left: 0.3em
    cursor: text

  .search-icon
    color: $color-icon

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

<template lang="pug">
  span.mdi(:class="[`mdi-${this.icon}`, { clickable }]" @click="onClick")
</template>

<script>
  export default {
    props: {
      icon: { type: String, required: true },
      clickable: { type: Boolean, default: true },
    },

    methods: {
      onClick(e) {
        if (this.clickable) {
          this.$emit('click', e)
        }
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .mdi.clickable
    color: $color-icon
    cursor: pointer

    &:hover
      color: $color-icon-hover
</style>

<template lang="pug">
  span.mdi(:class="`mdi-${name}`" @click="$emit('click')")
</template>

<script>
  export default {
    props: {
      name: { type: String, required: true },
    },
  }
</script>

<style lang="stylus" scoped>
  .mdi
    cursor: pointer
</style>

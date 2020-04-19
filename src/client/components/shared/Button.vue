<template lang="pug">
  button {{ text }}
</template>

<script>
  export default {
    props: {
      text: { type: String, required: true },
    },
  }
</script>

<style lang="stylus" scoped>
  button
    padding: 0.4em 1em
    outline: none
    border: none
    border-radius: 4px
    background-color: #2974cf
    color: white
    font-size: 0.9em

    &:hover
      background-color: #2f86e2
</style>

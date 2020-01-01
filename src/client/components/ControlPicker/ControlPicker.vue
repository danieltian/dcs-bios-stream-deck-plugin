<template lang="pug">
  Panel(title="Select Control")
    .control-picker
      h1 Hello from control picker!
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import Panel from '@components/shared/Panel.vue'

  @Component({ components: { Panel } })
  export default class Button extends Vue {}
</script>

<style lang="stylus" scoped></style>

<template lang="pug">
  button(v-if="output") {{ output.module }} - {{ output.name }}
</template>

<script>
  export default {
    props: {
      globalId: { type: String, required: true }
    },

    data: () => ({
      output: undefined
    }),

    async created() {
      this.output = await this.$plugin.getOutput(this.globalId)
    }
  }
</script>

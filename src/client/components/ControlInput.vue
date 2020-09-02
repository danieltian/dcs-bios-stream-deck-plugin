<template lang="pug">
  .input(v-if="input")
    label Global ID
    button(@click="changeInput") {{ input.module }} - {{input.category}} - {{ input.description }}
    label Command
    input(v-model="config.command")
    Icon(name="trash-can-outline" @click="$emit('delete')")
</template>

<script>
  export default {
    props: {
      config: { type: Object, required: true },
    },

    data: () => ({
      input: undefined,
    }),

    watch: {
      'config.globalId': {
        immediate: true,
        async handler() {
          this.input = await this.$plugin.getInput(this.config.globalId)
        },
      },
    },

    methods: {
      changeInput() {
        this.$eventBus.changeInput(this.input).then((control) => {
          this.config.globalId = control.globalId
        })
      },
    },
  }
</script>

<style lang="stylus" scoped></style>

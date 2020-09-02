<template lang="pug">
  .editable-label.flex
    input.input(type="text" ref="textbox" v-if="isEditing" :value="value" @input="emit" @blur="disableEditing")
    label.label(v-else @dblclick="enableEditing") {{ value }}
</template>

<script>
  export default {
    props: {
      value: { type: String, required: true },
    },
    data: () => ({
      isEditing: false,
    }),
    methods: {
      async enableEditing() {
        this.isEditing = true
        await this.$nextTick()
        this.$refs.textbox.focus()
        this.$refs.textbox.select()
      },

      disableEditing() {
        this.isEditing = false
      },

      emit() {
        this.$emit('input', this.value)
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .input
    outline: none
    padding: 0.3em 0.4em

  .label
    cursor: pointer
</style>

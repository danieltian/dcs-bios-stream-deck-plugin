<template lang="pug">
  .editable-label.flex
    input.input(
      v-if="isEditing"
      :value="value"
      type="text"
      ref="textbox"
      @blur="save"
      @keydown.enter="save"
      @keydown.esc="cancel")
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

      cancel() {
        this.isEditing = false
      },

      save(e) {
        // If the user presses escape, cancel() will be called immediately followed by save(), because the input field
        // has blurred. We can differentiate between an actual save and a cancel-then-save by checking isEditing.
        if (this.isEditing === false) return

        this.$emit('input', e.target.value)
        this.isEditing = false
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

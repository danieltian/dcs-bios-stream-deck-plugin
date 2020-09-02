<template lang="pug">
  li.control(@click="$emit('click', control)") {{ control.category }} - {{ control.description }} - {{ type }} {{ value }}
</template>

<script>
  export default {
    props: {
      control: { type: Object, required: true }
    },

    data() {
      return {
        value: undefined,
        setValueLocal: this.setValue.bind(this)
      }
    },

    computed: {
      type() {
        const type = this.control.physicalVariant || this.control.controlType
        return type.replace(/_/g, ' ').toLocaleUpperCase()
      }
    },

    watch: {
      control: {
        immediate: true,
        handler() {
          this.$plugin.watch(this.control.globalId, this.setValue)
        }
      }
    },

    destroyed() {
      this.$plugin.unwatch(this.control.globalId, this.setValue)
    },

    methods: {
      setValue(value) {
        console.log('setValue', this)
        this.value = value
      }
    }
  }
</script>

<style lang="stylus"></style>

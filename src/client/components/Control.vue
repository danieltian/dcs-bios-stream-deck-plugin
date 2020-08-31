<template lang="pug">
  li.control(@click="$emit('click', control)") {{ control.category }} - {{ control.description }} - {{ type }}
</template>

<script>
  export default {
    props: {
      control: { type: Object, required: true }
    },

    computed: {
      type() {
        const type = this.control.physicalVariant || this.control.controlType
        return type.replace(/_/g, ' ').toLocaleUpperCase()
      }
    }
  }
</script>

<style lang="stylus">

</style>

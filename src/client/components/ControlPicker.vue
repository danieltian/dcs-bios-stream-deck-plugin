<template lang="pug">
  .control-picker(v-if="isVisible")
    select(v-model="selectedModule")
      option(v-for="module in modules") {{ module }}

    ul.controls
      li.control(v-for="control in controls" @click="selectControl(control)") {{ control.category }} - {{ control.control_description }}
</template>

<script>
  export default {
    data: () => ({
      isVisible: false,
      selected: undefined,
      modules: [],
      selectedModule: undefined,
      controls: [],
    }),

    watch: {
      async selectedModule() {
        this.controls = await this.$plugin.getOutputsForModule(this.selectedModule)
      },
    },

    async created() {
      this.modules = await this.$plugin.getModules()

      this.$eventBus.$on('showOutputPicker', (selected) => {
        this.selected = selected
        this.selectedModule = selected.module
        this.isVisible = true
      })
    },

    methods: {
      selectControl(control) {
        this.$eventBus.$emit('controlSelected', control.globalId)
        this.isVisible = false
      },
    },
  }
</script>

<style lang="stylus" scoped>
  $padding = 2em

  .control-picker
    position: fixed
    background-color: lightslategray
    top: $padding
    bottom: $padding
    left: $padding
    right: $padding
    overflow: auto

  .control:hover
    color: white
    background-color: blue
    cursor: pointer
</style>

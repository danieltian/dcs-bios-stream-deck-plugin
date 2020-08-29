<template lang="pug">
  .backdrop(v-if="isVisible")
    .control-picker
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

      this.$controlPicker.on('show', (selected) => {
        this.selected = selected
        this.isVisible = true

        if (this.selected) {
          this.selectedModule = selected.module
        } else if (!this.selected)
        this.selectedModule = selected ? selected.module : (this.selectedModule || this.modules[0])
      })
    },

    methods: {
      selectControl(control) {
        this.$controlPicker.emit('selected', control)
        this.isVisible = false
      },
    },
  }
</script>

<style lang="stylus" scoped>
  $padding = 2em

  .backdrop
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    background-color: rgba(0, 0, 0, 0.5)
    z-index: 1

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

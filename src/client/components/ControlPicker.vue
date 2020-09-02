<template lang="pug">
  .backdrop(v-if="isVisible")
    .control-picker
      select(v-model="selectedModule")
        option(v-for="module in modules") {{ module }}

      input(type="text" v-model="filter")
      button(@click="close") Cancel

      ul.controls
        Control(v-for="control in filteredControls" :key="control.globalId" :control="control" @click="selectControl")
</template>

<script>
  import Control from './Control.vue'

  export default {
    components: { Control },

    data: () => ({
      isVisible: false,
      modules: [],
      selectedModule: undefined,
      controls: [],
      selectedControl: undefined,
      filter: '',
      type: '',
      value: undefined
    }),

    computed: {
      filteredControls() {
        // Filter the controls by the category and description, removing all spaces.
        return this.controls.filter((control) => {
          const category = control.category.replace(/_ /g, '').toLocaleLowerCase()
          const description = control.description.replace(/_ /g, '').toLocaleLowerCase()

          return category.includes(this.filter) || description.includes(this.filter)
        })
      },
    },

    watch: {
      async selectedModule() {
        if (this.type === 'output') {
          this.controls = await this.$plugin.getOutputsForModule(this.selectedModule)
        }
        else {
          this.controls = await this.$plugin.getInputsForModule(this.selectedModule)
        }
      },
    },

    async created() {
      this.modules = await this.$plugin.getModules()

      this.$eventBus.on('show', (control, type) => {
        this.selectedControl = control
        this.isVisible = true
        this.type = type

        this.selectedModule = control ? control.module : this.modules[0]
      })
    },

    methods: {
      selectControl(control) {
        this.$eventBus.emit('selected', control)
        this.isVisible = false
      },

      close() {
        this.isVisible = false
      },

      setValue(value) {
        this.value = value
      }
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

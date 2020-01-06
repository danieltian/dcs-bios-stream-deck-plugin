<template lang="pug">
  Panel.control-picker(title="Select Control")
    template(#topbar)
      .filters
        Dropdown(:values="aircraftNames" :selected="selectedAircraft" @change="setSelectedAircraft")
        Search(v-model="filter")

    .controls
      Control(v-for="control in filteredControls" :control="control" :key="control.id")
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'
  import Panel from '@shared/Panel.vue'
  import Dropdown from '@shared/Dropdown.vue'
  import Search from './Search.vue'
  import Control from './Control.vue'
  import { ClientControl } from '@/types'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function getJson(url: string): Promise<any> {
    const response = await fetch(url)
    const json = await response.json()
    return json
  }

  @Component({ components: { Panel, Dropdown, Search, Control } })
  export default class ControlPicker extends Vue {
    aircraftNames = []
    selectedAircraft = ''
    filter = ''
    controls: ClientControl[] = []

    async mounted(): Promise<void> {
      this.aircraftNames = await getJson('/aircraft-names')
      // Select the first aircraft in the aircraft list if there's no selected aircraft.
      if (!this.selectedAircraft) {
        this.selectedAircraft = this.aircraftNames[0]
      }
    }

    // Filter the controls based on the filter string.
    get filteredControls(): ClientControl[] {
      if (!this.filter) return this.controls

      return this.controls.filter(control => {
        const category = control.category.replace(/_ /g, '').toLocaleLowerCase()
        const description = control.description.replace(/_ /g, '').toLocaleLowerCase()

        return category.includes(this.filter) || description.includes(this.filter)
      })
    }

    // Change the selected aircraft and get its controls.
    setSelectedAircraft(selectedAircraft: string): void {
      this.selectedAircraft = selectedAircraft
    }

    // When selectedAircraft is changed, get the controls for it.
    @Watch('selectedAircraft')
    async getSelectedAircraftControls(selectedAircraft: string): Promise<void> {
      this.controls = await getJson('/aircraft-controls/' + selectedAircraft)
    }
  }
</script>

<style lang="stylus" scoped>
  $margin = 2em

  .control-picker
    position: fixed
    top: $margin
    right: $margin
    bottom: $margin
    left: $margin

  .filters
    display: flex
    border-bottom: 1px solid $color-border

    .dropdown
      // top: 600px
      width: 10em
      border-right: 1px solid $color-border
</style>

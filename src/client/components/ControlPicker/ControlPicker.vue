<template lang="pug">
  Panel.control-picker(title="Select Control")
    .filters
      Dropdown(:values="aircraftNames" :selected="selectedAircraft" @change="setSelectedAircraft")
      Search(v-model="filter")
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import Panel from '@shared/Panel.vue'
  import Dropdown from '@shared/Dropdown.vue'
  import Search from './Search.vue'

  @Component({ components: { Panel, Dropdown, Search } })
  export default class ControlPicker extends Vue {
    aircraftNames = ['Ka-50', 'A-10C', 'Metadata']
    selectedAircraft = 'Ka-50'
    filter = ''

    mounted(): void {
      // Select the first aircraft in the aircraft list if there's no selected aircraft.
      if (!this.selectedAircraft) {
        this.selectedAircraft = this.aircraftNames[0]
      }
    }

    setSelectedAircraft(selectedAircraft: string): void {
      this.selectedAircraft = selectedAircraft
    }
  }
</script>

<style lang="stylus" scoped>
  $margin = 2em

  .control-picker
    position: fixed
    left: $margin
    right: $margin
    top: $margin
    bottom: $margin

  .filters
    display: grid
    grid-template-columns: 8.5em 1fr
    border-bottom: 1px solid $color-border

    .dropdown
      border-right: 1px solid $color-border

    input
      color: $color-text
      font-size: 0.9em
      padding: 0 0.4em
      outline: none
      background: none
      border: none
</style>

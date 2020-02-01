<template lang="pug">
  Panel.control-picker(title="Select Control")
    template(#topbar)
      .filters
        Dropdown(:values="aircraftNames" :selected="selectedAircraft" @change="setSelectedAircraft")
        Search(v-model="filter")

    .controls
      Control(v-for="control in filteredControls" :control="control" :key="control.id")
</template>

<script>
  import Search from './Search.vue'
  import Control from './Control.vue'

  async function getJson(url) {
    const response = await fetch(url)
    const json = await response.json()
    return json
  }

  export default {
    components: { Search, Control },

    data: () => ({
      aircraftNames: [],
      selectedAircraft: '',
      filter: '',
      controls: []
    }),

    computed: {
      filteredControls() {
        if (!this.filter) return this.controls // If there's no filter, return all the controls.

        // Filter the controls by the category and description, removing all spaces.
        return this.controls.filter(control => {
          const category = control.category.replace(/_ /g, '').toLocaleLowerCase()
          const description = control.description.replace(/_ /g, '').toLocaleLowerCase()

          return category.includes(this.filter) || description.includes(this.filter)
        })
      }
    },

    watch: {
      async selectedAircraft(newAircraft) {
        // When selectedAircraft is changed, get the controls for it.
        this.controls = await getJson('/aircraft-controls/' + this.selectedAircraft)
      }
    },

    async mounted() {
      this.aircraftNames = await getJson('/aircraft-names')
      // Select the first aircraft in the aircraft list if there's no selected aircraft.
      if (!this.selectedAircraft) {
        this.selectedAircraft = this.aircraftNames[0]
      }
    },

    methods: {
      // Change the selected aircraft.
      setSelectedAircraft(newAircraft) {
        this.selectedAircraft = newAircraft
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .filters
    display: flex
    border-bottom: 1px solid $color-border

    .dropdown
      width: 10em
      border-right: 1px solid $color-border
</style>

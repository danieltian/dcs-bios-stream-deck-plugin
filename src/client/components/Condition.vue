<template lang="pug">
  .condition(v-if="output")
    label Global ID
    button(@click="changeOutput") {{ output.module }} - {{ output.controlDescription }}
    label Condition
    select(v-model="config.condition")
      option(value="eq") is equal to
      option(value="gt") is greater than
      option(value="lt") is less than
      option(value="gte") is greater than or equal to
      option(value="lte") is less than or equal to
      option(value="neq") is not equal to
      option(value="contains") contains
      option(value="notcontains") does not contain
    label Value
    input(v-model="config.value")
    Icon(name="trash-can-outline" @click="$emit('delete')")
</template>

<script>
  export default {
    props: {
      config: { type: Object, required: true },
    },

    data: () => ({
      output: undefined,
    }),

    watch: {
      'config.globalId': {
        immediate: true,
        async handler() {
          this.output = await this.$plugin.getOutput(this.config.globalId)
        },
      },
    },

    methods: {
      changeOutput() {
        this.$eventBus.changeOutput(this.output).then((control) => {
          this.config.globalId = control.globalId
        })
      },
    },
  }
</script>

<template lang="pug">
  #app
    div.context
      label Context:
      input(type="text" :value="context")

    div.layers
      div(v-for="layer in settings.layers")
        div(style="margin-bottom: 20px")
          | {{ layer.name }}
          img(:src="layer.image" width="72" height="72")
          label X
          input(v-model="layer.source.x")
          label Y
          input(v-model="layer.source.y")
          label Width
          input(v-model="layer.source.width")
          label Height
          input(v-model="layer.source.height")
          label Output Logic
          select(v-model="layer.outputLogic")
            option(value="AND") AND
            option(value="OR") OR
          div.output(v-for="output in layer.outputs")
            label Global ID
            input(v-model="output.globalId")
            label Condition
            input(v-model="output.condition")
            label Value
            input(v-model="output.value")
          button(@click="addOutput(layer)") Add Output

    div.inputs
      h3 Press
      label Global ID
      input(v-model="settings.inputs.press.globalId")
      label Command
      input(v-model="settings.inputs.press.command")

      h3 Release
      label Global ID
      input(v-model="settings.inputs.release.globalId")
      label Command
      input(v-model="settings.inputs.release.command")

    button(@click="saveSettings") Save
</template>

<script>
  export default {
    data: () => ({
      context: '',
      settings: '',
    }),

    mounted() {
      this.websocket = new WebSocket('ws://localhost:12345')

      this.websocket.addEventListener('message', ({ data }) => {
        const message = JSON.parse(data)

        if (message.event === 'didReceiveSettings') {
          this.context = message.context

          message.payload.settings.inputs = message.payload.settings.inputs || {
            press: { globalId: undefined, command: undefined },
            release: { globalId: undefined, command: undefined },
          }

          this.settings = message.payload.settings
        }
      })
    },

    methods: {
      saveSettings() {
        this.websocket.send(
          JSON.stringify({
            event: 'setSettings',
            context: this.context,
            payload: this.settings,
          })
        )
      },

      addOutput(layer) {
        layer.outputs.push({ globalId: undefined, condition: undefined, value: undefined })
      },
    },
  }
</script>

<style lang="stylus">
  body
    background-color: lightgray
</style>

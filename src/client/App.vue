<template lang="pug">
  #app
    input(type="file" ref="imageAddInput" @change="addImageLayer")
    input(type="file" ref="imageEditInput" @change="changeLayerImage")

    div.context
      label Context:
      input(type="text" :value="context")

    template(v-if="settings")
      button(@click="openImageAddDialog") Add Layer

      div.layers
        div(v-for="layer in settings.layers")
          div(style="margin-bottom: 20px")
            span.mdi(class="mdi-trash-can-outline" @click="deleteLayer(layer)")
            input(v-model="layer.name")
            img(:src="layer.image" width="72" height="72" @click="openImageEditDialog(layer)")
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
              select(v-model="output.condition")
                option(value="eq") is equal to
                option(value="gt") is greater than
                option(value="lt") is less than
                option(value="gte") is greater than or equal to
                option(value="lte") is less than or equal to
                option(value="neq") is not equal to
                option(value="contains") contains
                option(value="notcontains") does not contain
              label Value
              input(v-model="output.value")
              span.mdi(class="mdi-trash-can-outline" @click="deleteOutput(output, layer)")
            button(@click="addOutput(layer.outputs)") Add Output

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
import merge from 'lodash.merge'
import {settings} from '../defaults'

export default {
    data: () => ({
      context: '',
      settings,
      selectedLayer: undefined,
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

          this.settings = merge(this.settings, message.payload.settings)
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

      openImageAddDialog() {
        this.$refs.imageAddInput.click()
      },

      openImageEditDialog(layer) {
        this.selectedLayer = layer
        this.$refs.imageEditInput.click()
      },

      async addImageLayer(e) {
        const file = e.target.files[0]
        const image = await this.getImageData(file)

        this.settings.layers.push({
          name: file.name,
          image,
          source: { x: 0, y: 0, width: 72, height: 72 },
          outputLogic: 'AND',
          outputs: [],
        })
      },

      async changeLayerImage(e) {
        const file = e.target.files[0]
        this.selectedLayer.image = await this.getImageData(file)
      },

      getImageData(file) {
        return new Promise((resolve) => {
          const reader = new FileReader()

          reader.addEventListener('load', () => {
            resolve(reader.result)
          })

          reader.readAsDataURL(file)
        })
      },

      addOutput(outputs) {
        outputs.push({ globalId: undefined, condition: 'eq', value: undefined })
      },

      deleteOutput(output, layer) {
        layer.outputs = layer.outputs.filter((x) => x !== output)
      },

      deleteLayer(layer) {
        this.settings.layers = this.settings.layers.filter((x) => x !== layer)
      },
    },
  }
</script>

<style lang="stylus">
  @import '~@mdi/font/css/materialdesignicons.min.css'

  body
    background-color: lightgray
</style>

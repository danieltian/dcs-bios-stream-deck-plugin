<template lang="pug">
  #app
    ControlPicker
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

            Output(v-for="(output, index) in layer.outputs" :key="index" :config="output" @delete="deleteOutput(output, layer)")
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
  import Output from '@components/Output.vue'
  import ControlPicker from '@components/ControlPicker.vue'

  export default {
    components: { Output, ControlPicker },

    data: () => ({
      context: '',
      settings: undefined,
      selectedLayer: undefined,
    }),

    mounted() {
      this.$plugin.on('didReceiveSettings', ({ context, payload }) => {
        this.context = context
        this.settings = payload.settings
      })

      this.$plugin.getOutputsForModule('Ka-50')
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

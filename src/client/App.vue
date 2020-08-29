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

            v-stage(:config="{ width: 72, height: 72 }")
              v-layer
                KonvaImage(:imageSrc="layer.image")

            img(:src="layer.image" width="72" height="72" @click="openImageEditDialog(layer)")
            label X
            input(v-model="layer.source.x")
            label Y
            input(v-model="layer.source.y")
            label Width
            input(v-model="layer.source.width")
            label Height
            input(v-model="layer.source.height")
            label Condition Logic
            select(v-model="layer.conditionLogic")
              option(value="AND") AND
              option(value="OR") OR

            Condition(v-for="(condition, index) in layer.conditions" :key="index" :config="condition" @delete="deleteCondition(condition, layer)")
            button(@click="addCondition(layer.conditions)") Add Condition

      div.inputs
        h3 Press
        label Global ID
        input(v-model="settings.inputs.press.globalId" v-if="settings.inputs.press")
        label Command
        input(v-model="settings.inputs.press.command" v-if="settings.inputs.press")

        h3 Release
        label Global ID
        input(v-model="settings.inputs.release.globalId" v-if="settings.inputs.release")
        label Command
        input(v-model="settings.inputs.release.command" v-if="settings.inputs.release")

      button(@click="saveSettings") Save
</template>

<script>
  import Condition from '@components/Condition.vue'
  import ControlPicker from '@components/ControlPicker.vue'
  import KonvaImage from '@components/KonvaImage.vue'

  export default {
    components: { Condition, ControlPicker, KonvaImage },

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
    },

    methods: {
      saveSettings() {
        this.$plugin.saveSettings(this.settings, this.context)
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
        console.log('file', file)
        const image = await this.getImageData(file)

        this.settings.layers.push({
          name: file.name,
          image,
          source: { x: 0, y: 0, width: 72, height: 72 },
          conditionLogic: 'AND',
          conditions: [],
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

      addCondition(conditions) {
        this.$controlPicker.changeControl(undefined, (control) => {
          conditions.push({ globalId: control.globalId, condition: 'eq', value: '0' })
        })
      },

      deleteCondition(condition, layer) {
        layer.conditions = layer.conditions.filter((x) => x !== condition)
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

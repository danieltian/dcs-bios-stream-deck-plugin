<template lang="pug">
  .app
    ControlPicker
    ImagePicker

    template(v-if="settings")
      .sidebar
        button(@click="addImageLayer") Add Image Layer
        .layers
          Layer(v-for="(layer, index) in settings.layers" :layer="layer" :isSelected="layer === selectedLayer" :key="`${layer.name}:${index}`" @delete="deleteLayer(layer)" @click="selectLayer(layer)")

      .image-editor
        v-stage.stage(:config="stageConfig" ref="stage" :class="{ move: cursor }")
          v-layer
            KonvaImage(v-for="(layer, index) in settings.layers" :imageSrc="layer.image" :isSelected="layer === selectedLayer" :config="layer.config" :key="`${layer.name}:${index}`" @mouseenter="showMoveCursor" @mouseleave="hideMoveCursor")

        .settings(v-if="selectedLayer")
          label X
          input(type="number" v-model.number="selectedLayer.config.x")
          label Y
          input(type="number" v-model.number="selectedLayer.config.y")
          label Width
          input(type="number" v-model.number="selectedLayer.config.width")
          label Height
          input(type="number" v-model.number="selectedLayer.config.height")

      .configuration

    //-
      div.context
        label Context:
        input(type="text" :value="context")

      template(v-if="settings")
        button(@click="openImageAddDialog") Add Layer

        div.layers
          div(v-for="layer in settings.layers")
            div(style="margin-bottom: 20px")
              Icon(name="trash-can-outline" @click="deleteLayer(layer)")
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

              Condition(
                v-for="(condition, index) in layer.conditions" :key="`${layer.name}:${condition.globalId} ${condition.condition} ${condition.value}`" :config="condition" @delete="deleteCondition(condition, layer)")
              button(@click="addCondition(layer.conditions)") Add Condition

        div.inputs
          h3 Press
          ControlInput(v-for="(input, index) in settings.inputs.press" :key="`press:${index}`" :config="input" @delete="deleteInput(input, 'press')")
          button(@click="addInput(settings.inputs.press)") Add Press

          h3 Release
          ControlInput(v-for="(input, index) in settings.inputs.release" :key="`release:${index}`" :config="input" @delete="deleteInput(input, 'release')")
          button(@click="addInput(settings.inputs.release)") Add Release

    //
    button(@click="saveSettings") Save
</template>

<script>
  export default {
    data: () => ({
      context: '',
      settings: undefined,
      selectedLayer: undefined,
      stageConfig: { width: 72 * 4, height: 72 * 4, scaleX: 4, scaleY: 4 },
      cursor: false
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

      addImageLayer() {
        this.$eventBus.changeImage().then(({ name, base64: image }) => {
          this.settings.layers.push({
            name,
            image,
            config: { x: 0, y: 0, width: 72, height: 72 },
            conditionLogic: 'AND',
            conditions: [],
          })
        })
      },

      openImageEditDialog(layer) {
        this.selectedLayer = layer
        this.$eventBus.changeImage().then(({ base64 }) => (this.selectedLayer.image = base64))
      },

      addCondition(conditions) {
        this.$eventBus.changeOutput().then((control) => {
          conditions.push({ globalId: control.globalId, condition: 'eq', value: '0' })
        })
      },

      deleteCondition(condition, layer) {
        layer.conditions = layer.conditions.filter((x) => x !== condition)
      },

      deleteLayer(layer) {
        this.settings.layers = this.settings.layers.filter((x) => x !== layer)
      },

      addInput(configType) {
        this.$eventBus.changeInput().then((control) => {
          configType.push({ globalId: control.globalId, command: '' })
        })
      },

      deleteInput(input, category) {
        this.settings.inputs[category] = this.settings.inputs[category].filter((x) => x !== input)
      },

      selectLayer(layer) {
        this.selectedLayer = layer
      },

      showMoveCursor() {
        this.cursor = true
      },

      hideMoveCursor() {
        this.cursor = false
      }
    },
  }
</script>

<style lang="stylus">
  @require '~@mdi/font/css/materialdesignicons.min.css'
  @require './styles/colors.styl'
  @require './styles/global.styl'

  body
    margin: 0
    user-select: none

  input
    color: $color-input-text
    border-color: $color-input-border
    font-family: Trebuchet MS, roboto, ubuntu, sans-serif
    font-size: 0.9em

  .app
    width: 100vw
    height: 100vh
    background-color: $color-base
    color: $color-text
    display: grid
    grid-template: "sidebar image-preview"\
                   "sidebar configuration"\
                   1fr / 20% 1fr
    font-family: Trebuchet MS, roboto, ubuntu, sans-serif

    .sidebar
      grid-area: sidebar
      border-right: 2px solid $color-sidebar-border

    .image-preview
      grid-area: image-preview

    .configuration
      grid-area: configuration

  .stage.move
    cursor: move
</style>

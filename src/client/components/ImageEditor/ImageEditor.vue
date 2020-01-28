<template lang="pug">
  Panel(title="Image Editor")
    .image-editor
      ImagePreview.image-preview(@click="changeImage" :images="images" :settings="imageSettings")
      input#file-selector(type="file" ref="fileInput" @change="onFileSelected")

      .settings
        label.setting-label Preset
        ButtonGroup(:options="['fill', 'fit', 'stretch', 'custom']" v-model="scaling")
        label.settings-label Position
        ButtonGroup(:options="positionOptions" v-model="position")
</template>

<script lang="ts">
  import { ImageSettings } from '@/types'
  import { Component, Vue } from 'vue-property-decorator'
  import Panel from '@shared/Panel.vue'
  import ButtonGroup from '@shared/ButtonGroup.vue'
  import ImagePreview from '@shared/ImagePreview.vue'
  import md5 from 'md5'

  @Component({ components: { Panel, ImagePreview, ButtonGroup } })
  export default class ImageEditor extends Vue {
    scaling = 'fill'
    position = ''
    images: { [key: string]: string } = {}
    imageSettings: ImageSettings = { id: '' }

    get positionOptions(): string[] {
      return ['left', 'center', 'right'];
    }

    changeImage(): void {
      (this.$refs.fileInput as HTMLInputElement).click()
    }

    onFileSelected(e: Event): void {
      const files = (e.target as HTMLInputElement).files

      if (files) {
        const reader = new FileReader()

        reader.addEventListener('load', () => {
          const result = reader.result as string

          const hash = md5(result)
          this.images[hash] = result
          this.imageSettings.id = hash
        })

        reader.readAsDataURL(files[0])
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .image-editor
    flexCenter()
    flex-direction: column
    align-items: center
    margin-top: 2em

  .image-preview
    width: 144px
    height: 144px

  #file-selector
    display: none

  .settings
    display: grid
    align-items: center
    margin-top: 2em
    grid-gap: 1em
    grid-template-columns: min-content 1fr

  .setting-label
    text-align: right
    font-size: 1.1em
</style>

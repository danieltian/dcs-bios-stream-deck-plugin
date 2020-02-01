<template lang="pug">
  Panel(title="Image Editor")
    .image-editor
      ImagePreview.image-preview(@click="changeImage" :images="images" :settings="imageSettings")
      input#file-selector(type="file" ref="fileInput" @change="onFileSelected")

      .settings
        label.setting-label Preset
        ButtonGroup(:options="['fill', 'fit', 'stretch']" v-model="scaling")
        label.settings-label Position
        ButtonGroup(:options="positionOptions" v-model="position")
</template>

<script>
  import md5 from 'md5'

  export default {
    data: () => ({
      scaling: 'fill',
      position: '',
      images: {},
      imageSettings: {}
    }),

    computed: {
      positionOptions() {
        return ['left', 'center', 'right']
      }
    },

    methods: {
      changeImage() {
        this.$refs.fileInput.click()
      },

      onFileSelected(e) {
        const files = e.target.files
        const reader = new FileReader()

        reader.addEventListener('load', () => {
          const result = reader.result

          const hash = md5(result)
          this.$set(this.images, hash, result)
          this.$set(this.imageSettings, 'id', hash)
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

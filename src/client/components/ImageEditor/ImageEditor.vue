<template lang="pug">
  Panel(title="Image Editor")
    .image-editor
      ImagePreview.image-preview(@click="changeImage" :settings="settings")
      input#file-selector(type="file" ref="fileInput" @change="onFileSelected")

      .settings(v-if="settings.image")
        label.setting-label Preset
        ButtonGroup(:options="['fill', 'fit', 'stretch']" v-model="scaling")
        label.settings-label Position
        ButtonGroup(:options="positionOptions" v-model="position")
</template>

<script>
  export default {
    data: () => ({
      scaling: 'fill',
      positionOptions: [],
      position: '',
      image: new Image(),
      settings: { image: '', x: 0, y: 0, width: 0, height: 0 }
    }),

    watch: {
      scaling() {
        this.processImageSize(this.settings.image)
      },

      position() {
        const image = this.image

        if (this.position == 'left') {
          this.settings.x = 0
        } else if (this.position == 'center') {
          this.settings.x = (image.width / 2) - (image.height / 2) // prettier-ignore
        } else if (this.position == 'right') {
          this.settings.x = image.width - image.height
        } else if (this.position == 'top') {
          this.settings.y = 0
        } else if (this.position == 'middle') {
          this.settings.y = (image.height / 2) - (image.width / 2) // prettier-ignore
        } else if (this.position == 'bottom') {
          this.settings.y = image.height - image.width
        }
      }
    },

    methods: {
      changeImage() {
        this.$refs.fileInput.click() // Open the file select dialog.
      },

      onFileSelected(e) {
        if (!e.target.files.length) return

        const files = e.target.files
        const reader = new FileReader()

        reader.addEventListener('load', () => {
          const result = reader.result
          this.settings.image = result
          this.processImageSize(result)
        })

        reader.readAsDataURL(files[0])
      },

      updateSettings(newSettings) {
        Object.assign(this.settings, newSettings)
      },

      processImageSize(imageSrc) {
        const image = this.image
        image.src = imageSrc

        image.addEventListener('load', () => {
          // Fill as much of the button as possible while preserving aspect ratio.
          if (this.scaling == 'fill') {
            // Image is wide.
            if (image.width > image.height) {
              this.updateSettings({
                x: (image.width / 2) - (image.height / 2), // prettier-ignore
                y: 0,
                width: image.height,
                height: image.height
              })
            }
            // Image is tall.
            else {
              this.updateSettings({
                x: 0,
                y: (image.height / 2) - (image.width / 2), // prettier-ignore
                width: image.width,
                height: image.width
              })
            }
          }
          // Fit the entire image within the button while preserving aspect ratio.
          else if (this.scaling == 'fit') {
            // Image is wide.
            if (image.width > image.height) {
              this.updateSettings({
                x: 0,
                y: (image.height / 2) - (image.width / 2), // prettier-ignore
                width: image.width,
                height: image.width
              })
            }
            // Image is tall.
            else {
              this.updateSettings({
                x: (image.width / 2) - (image.height / 2), // prettier-ignore
                y: 0,
                width: image.height,
                height: image.height
              })
            }
          }
          // Fill the entire button with the image, ignoring aspect ratio.
          else if (this.scaling == 'stretch') {
            this.updateSettings({
              x: 0,
              y: 0,
              width: image.width,
              height: image.height
            })
          }

          if (image.width > image.height) {
            this.positionOptions = ['left', 'center', 'right']
            this.position = 'center'
          } else {
            this.positionOptions = ['top', 'middle', 'bottom']
            this.position = 'middle'
          }
        })
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

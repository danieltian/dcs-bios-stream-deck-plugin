<template lang="pug">
  input.image-picker(type="file" ref="imageInput" @change="processImageFile")
</template>

<script>
  export default {
    created() {
      this.$eventBus.on('selectImage', () => this.$refs.imageInput.click())
    },

    methods: {
      async processImageFile(e) {
        if (!e.target.files.length) return

        const file = e.target.files[0]
        file.base64 = await this.getImageData(file)
        this.$eventBus.emit('imageSelected', file)
      },

      getImageData(file) {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.addEventListener('load', () => resolve(reader.result))
          reader.readAsDataURL(file)
        })
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .image-picker
    display: none
</style>

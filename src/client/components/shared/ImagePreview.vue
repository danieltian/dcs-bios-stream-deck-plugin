<template lang="pug">
  label.image-preview(@click="onClick" :class="{ 'has-image': settings.id }")
    canvas.canvas(v-if="settings.id" ref="canvas")
    Icon.add-icon(v-else icon="image-plus" :clickable="false")
</template>

<script>
  export default {
    props: {
      settings: { type: Object, required: true },
      images: { type: Object, required: true }
    },

    data: () => ({
      image: new Image()
    }),

    methods: {
      onClick(e) {
        this.$emit('click', e)
      },

      drawImage(image) {
        // TODO: compute these
        const canvas = this.$refs.canvas
        const context = canvas.getContext('2d')

        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height)
      }
    },

    watch: {
      'settings.id'() {
        this.image.addEventListener('load', () => {
          this.drawImage(this.image)
        })

        this.image.src = this.images[this.settings.id]
      }
    }
  }
</script>

<style lang="stylus" scoped>
  $image-border-radius = 2em

  .image-preview
    flexBoth()
    overflow: hidden
    border: 4px dashed
    border-radius: $image-border-radius
    color: #71767e
    cursor: pointer

    &:hover
      color: $color-icon-hover

    &.has-image
      border-style: solid

  .canvas
    width: 100%
    height: 100%

  .add-icon
    font-size: 3em
</style>

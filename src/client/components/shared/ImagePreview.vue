<template lang="pug">
  label.image-preview(@click="onClick" :class="{ 'has-image': settings.image }")
    canvas.canvas(v-if="settings.image" ref="canvas")
    Icon.add-icon(v-else icon="image-plus" :clickable="false")
</template>

<script>
  export default {
    props: {
      settings: { type: Object, required: true }
    },

    data: () => ({ image: new Image() }),

    computed: {
      canvas() {
        return this.$refs.canvas
      },
      context() {
        return this.canvas && this.canvas.getContext('2d')
      }
    },

    watch: {
      'settings.image'() {
        this.image.addEventListener('load', () => {
          this.drawImage(this.image)
        })

        this.image.src = this.settings.image
      },

      settings: {
        deep: true,
        handler() {
          this.image.addEventListener('load', () => {
            this.drawImage(this.image)
          })

          this.image.src = this.settings.image
        }
      }
    },

    methods: {
      onClick(e) {
        this.$emit('click', e)
      },

      drawImage(image) {
        const s = this.settings
        const canvas = this.canvas

        this.context.clearRect(0, 0, canvas.width, canvas.height)
        this.context.drawImage(image, s.x, s.y, s.width, s.height, 0, 0, canvas.width, canvas.height)
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

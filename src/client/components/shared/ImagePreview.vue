<template lang="pug">
  label.image-preview(@click="onClick" :class="{ 'has-image': settings.id }")
    canvas.canvas(v-if="settings.id" ref="canvas")
    Icon.add-icon(v-else icon="image-plus" :clickable="false")
</template>

<script lang="ts">
  import { ImageSettings } from '@/types'
  import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
  import Icon from '@shared/Icon.vue'

  @Component({ components: { Icon } })
  export default class ImagePreview extends Vue {
    @Prop() readonly settings!: ImageSettings
    @Prop() readonly images!: { [key: string]: string }

    image = new Image()

    onClick(e: Event): void {
      this.$emit('click', e)
    }

    drawImage(image: HTMLImageElement): void {
      const canvas = (this.$refs.canvas as HTMLCanvasElement)
      const context = canvas.getContext('2d')

      if (context) {
        console.log('clearRect')
        context.clearRect(0, 0, canvas.width, canvas.height)
        console.log('drawImage')
        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height)
      }
    }

    @Watch('settings.id')
    onImageChanged(): void {
      this.image.addEventListener('load', () => {
        this.drawImage(this.image)
      })

      this.image.src = this.images[this.settings.id]
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

    &:active
      color: $color-icon-active

    &.has-image
      border-style: solid

  .canvas
    width: 100%
    height: 100%

  .add-icon
    font-size: 3em
</style>

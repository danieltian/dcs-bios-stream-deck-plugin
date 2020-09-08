<template lang="pug">
  v-image(:config="configWithImage" @mouseenter="mouseEnter" @mouseleave="mouseLeave" @dragmove="updatePosition" @wheel="changeZoom")
</template>

<script>
  export default {
    props: {
      imageSrc: { type: String, required: true },
      config: { type: Object, required: true },
      isSelected: { type: Boolean, required: true },
    },

    computed: {
      image() {
        const image = new Image()
        image.src = this.imageSrc
        return image
      },

      configWithImage() {
        return {
          ...this.config,
          image: this.image,
          draggable: this.isSelected,
        }
      },
    },

    methods: {
      mouseEnter() {
        if (!this.isSelected) return
        this.$emit('mouseenter')
      },

      mouseLeave() {
        if (!this.isSelected) return
        this.$emit('mouseleave')
      },

      updatePosition(e) {
        this.config.x = e.target.x()
        this.config.y = e.target.y()
      },

      changeZoom(e) {
        if (!this.isSelected) return

        const amount = e.evt.deltaY > 0 ? -1 : 1
        this.config.width = e.target.width() + amount
        this.config.height = e.target.height() + amount
      },
    },
  }
</script>

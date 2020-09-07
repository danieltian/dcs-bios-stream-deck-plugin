<template lang="pug">
  v-image(:config="configWithImage")
</template>

<script>
  export default {
    props: {
      imageSrc: { type: String, required: true },
      config: { type: Object, required: true }
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
        }
      },
    },
  }
</script>

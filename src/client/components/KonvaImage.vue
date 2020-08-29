<template lang="pug">
  v-image(:config="config")
</template>

<script>
  export default {
    props: {
      imageSrc: { type: String, required: true },
    },

    computed: {
      image() {
        const image = new Image()
        image.src = this.imageSrc
        return image
      },

      config() {
        return {
          image: this.image,
          width: 72,
          height: 72,
        }
      },
    },
  }
</script>

<template lang="pug">
  .layer.flex-center
    .thumbnail.flex-center-both
      img.thumbnail-image(:src="layer.image")
    EditableLabel.flex-1(v-model="layer.name")
    Icon(name="trash-can-outline" @click="$emit('delete')")
</template>

<script>
  export default {
    props: {
      layer: { type: Object, required: true },
    },

    methods: {
      deleteLayer(layer) {},
    },
  }
</script>

<style lang="stylus" scoped>
  .thumbnail
    width: 50px
    height: 50px

  .thumbnail-image
    // Clamp the max height and width to the size of the containing element.
    max-width: 100%
    max-height: 100%
</style>

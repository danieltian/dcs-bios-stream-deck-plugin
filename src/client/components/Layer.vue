<template lang="pug">
  .layer.flex-center.mb-2(:class="{ selected: isSelected }" @click="$emit('click')")
    .thumbnail.flex-center-both.mr-2(@click="changeImage")
      img.thumbnail-image(:src="layer.image")
    EditableLabel.flex-1(v-model="layer.name")
    Icon(name="trash-can-outline" @click="$emit('delete')")
</template>

<script>
  export default {
    props: {
      layer: { type: Object, required: true },
      isSelected: { type: Boolean, required: true },
    },

    methods: {
      changeImage() {
        this.$eventBus.changeImage().then(({ base64 }) => (this.layer.image = base64))
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .layer.selected
    background-color: $color-input-border

  .thumbnail
    width: 50px
    height: 50px
    border: 1px solid $color-sidebar-border

  .thumbnail-image
    // Clamp the max height and width to the size of the containing element.
    max-width: 100%
    max-height: 100%
</style>

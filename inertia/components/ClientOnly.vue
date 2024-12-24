<template>
  <div v-if="isClient">
    <slot />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isClient: false,
    }
  },
  mounted() {
    this.isClient = true
  },
}
</script>

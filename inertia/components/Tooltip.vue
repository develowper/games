<template>
  <div
    class="cursor-help"
    data-te-toggle="tooltip"
    data-te-placement="top"
    data-te-ripple-color="light"
    :title="content"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: ['title', 'content'],
  components: {},
  mounted() {
    // initTE({Tooltip});
  },
}
</script>

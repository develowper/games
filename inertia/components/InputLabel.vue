<script setup>
defineProps(['value'])
</script>

<template>
  <label class="block font-medium text-sm text-gray-700">
    <span v-if="value !== null && value !== undefined">{{ value }}</span>
    <span v-else><slot name="label" /></span>
  </label>
</template>

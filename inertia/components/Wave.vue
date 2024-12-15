<template>
  <svg v-if="!side || side=='bottom'" class="absolut z-[-1] opacity-70 bottom-0 w-full start-0 wave-top"
       viewBox="0 0 1439 147"
       version="1.1" xmlns="http://www.w3.org/2000/svg"
       xmlns:xlink="http://www.w3.org/1999/xlink">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-1.000000, -14.000000)" fill-rule="nonzero">
        <g class="wave " fill="#fff">
          <path
              d="M 106 -20 C 393 16 493 33 584 39 C 1306 33 1402 29 1444 34 L 1441.191 104.352 L 1.121 104.031 Z"></path>
        </g>
        <g transform="translate(0.000000, 50.000000)" class="fill-primary-500" fill=""
           fill-rule="nonzero">
          <path
              d="M 0.457 34.035 C 72 39 99 36 217 45 C 342 31 681 36 1216 12 C 1291 20 1402 29 1444 34 L 1441.191 104.352 L 1.121 104.031 L 0.457 34.035 Z"></path>
        </g>
      </g>
      <g transform="translate(0.000000, 50.000000)" class="fill-primary-200" fill="" fill-rule="nonzero">
        <path
            d="M 0.457 34.035 C 71 22 156 3 208 -2 C 248 5 1039 48 1124 55 C 1237 46 1355 27 1442 12 L 1441.191 104.352 L 1.121 104.031 L 0.457 34.035 Z"></path>
      </g>
    </g>
  </svg>

</template>

<script>
export default {
  name: "Wave",
  props: ['side']
}
</script>

<style scoped>

</style>
<script setup lang="ts">
withDefaults(
  defineProps<{
    value?: string,
    a?: number,
    b?: number,
    c?: number,
  }>(),
  { value: 'FRONTEND DEV * MOTION DESIGNER *', a: 180, b: 120, c: 50 },
)
</script>

<template>
  <svg
    class="wheel" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px" y="0px" :width="`${a * 2}px`" :height="`${a * 2}px`" :viewBox="`0 0 ${a * 2} ${a * 2}`" :enable-background="`new 0 0 ${a * 2} ${a * 2}`"
    xml:space="preserve"
  >
    <defs>
      <path id="criclePath" :d="` M ${a}, ${a} m -${b}, 0 a ${b},${b} 0 0,1 ${b * 2},0 a ${b},${b} 0 0,1 -${b * 2},0 `" />
    </defs>

    <g>
      <use xlink:href="#criclePath" fill="none" />
      <text class="fill-current">
        <textPath xlink:href="#criclePath" class="font-bold text-[42px]">
          {{ value }}
        </textPath>
      </text>
    </g>
  </svg>
</template>

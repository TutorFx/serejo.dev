<script setup lang="ts">
withDefaults(
  defineProps<{
    value?: string
    a?: number
    b?: number
    c?: number
  }>(),
  { value: 'FRONTEND DEV * MOTION DESIGNER *', a: 180, b: 120, c: 50 },
)

const pathId = useId()
</script>

<template>
  <svg
    class="wheel"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    :width="`${a * 2}px`"
    :height="`${a * 2}px`"
    :viewBox="`0 0 ${a * 2} ${a * 2}`"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <path
        :id="pathId"
        :d="` M ${a}, ${a} m -${b}, 0 a ${b},${b} 0 0,1 ${b * 2},0 a ${b},${b} 0 0,1 -${b * 2},0 `"
      />
    </defs>

    <text class="fill-current">
      <textPath :href="`#${pathId}`" class="text-[42px] font-bold">
        {{ value }}
      </textPath>
    </text>
  </svg>
</template>

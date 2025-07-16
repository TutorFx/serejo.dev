<script setup lang="ts">
import { onClickOutside, useElementBounding, useElementHover } from '@vueuse/core'
import type { StyleValue } from 'vue'

const popoverEl = useTemplateRef<HTMLButtonElement>('popover')
const popoverContentEl = useTemplateRef<HTMLButtonElement>('popover-content')

const isHovered = useElementHover(popoverEl, { delayLeave: 100 })
const isContentHovered = useElementHover(popoverContentEl)

const { x, y, width, height, update } = useElementBounding(popoverEl)
const { width: contentWidth, height: contentHeight, update: updateContent } = useElementBounding(popoverContentEl)

const style = computed(() => {
  return {
    top: y.value + height.value + 'px',
    left: x.value + width.value / 2 - contentWidth.value / 2 + 'px'

  } satisfies StyleValue
})
</script>

<template>
  <div ref="popover">
    <slot />
    <teleport to="body">
      <div v-if="isHovered || isContentHovered" :style="style" class="absolute z-50" ref="popover-content">
        <div class="h-2">

        </div>
        <div class="p-3 bg-base-300 text-base-content rounded-md">
          <slot name="content" />
        </div>
      </div>
    </teleport>
  </div>
</template>
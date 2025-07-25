<script lang="ts">
/* eslint-disable ts/no-empty-object-type */

export interface CardVariantProps {
  rounded?: boolean
  variant?: CardVariant
  border?: boolean
  class?: any
  ui?: Partial<{
    header: string
    content: string
    footer: string
  }>
}

export interface CardSlots {
  header: (props?: {}) => any
  default: (props?: {}) => any
  footer: (props?: {}) => any
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<CardVariantProps>(), { rounded: true, border: true, variant: CARD_DEFAULT_KEY })
const slots = defineSlots<CardSlots>()
const ui = genericCard()
const gridTemplateAreas = computed(() => {
  const area = []
  if ('header' in slots) {
    area.push('header')
  }
  if ('default' in slots) {
    area.push('content')
  }
  if ('footer' in slots) {
    area.push('footer')
  }
  return area.map(line => `"${line}"`).join(' ')
})

const gridTemplateRows = computed(() => {
  const row = []
  if ('header' in slots) {
    row.push('max-content')
  }
  if ('default' in slots) {
    row.push('1fr')
  }
  if ('footer' in slots) {
    row.push('max-content')
  }
  return row.join(' ')
})
</script>

<template>
  <div :class="ui.base({ ...props, class: props.class })" :style="{ gridTemplateAreas, gridTemplateRows }">
    <div
      v-if="'header' in slots"
      :class="ui.header({ class: props.ui?.header })"
      :style="{ gridArea: 'header' }"
    >
      <slot name="header" />
    </div>
    <div
      v-if="'default' in slots"
      :class="ui.content({ class: props.ui?.content })"
      :style="{ gridArea: 'content' }"
    >
      <slot />
    </div>
    <div
      v-if="'footer' in slots"
      :class="ui.footer({ class: props.ui?.footer })"
      :style="{ gridArea: 'footer' }"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

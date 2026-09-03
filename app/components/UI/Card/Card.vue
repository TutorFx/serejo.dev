<script lang="ts">
export interface CardVariantProps {
  rounded?: boolean
  variant?: CardVariant
  border?: boolean
  class?: string
  ui?: Partial<{
    header: string
    content: string
    footer: string
  }>
}

export interface CardSlots {
  header: (props?: object) => void
  default: (props?: object) => void
  footer: (props?: object) => void
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<CardVariantProps>(), { rounded: true, border: true, variant: CARD_DEFAULT_KEY })
const slots = defineSlots<CardSlots>()
const uiStyles = genericCard()
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
  <div :class="uiStyles.base({ ...props, class: props.class })" :style="{ gridTemplateAreas, gridTemplateRows }">
    <div
      v-if="'header' in slots"
      :class="uiStyles.header({ class: props.ui?.header })"
      :style="{ gridArea: 'header' }"
    >
      <slot name="header" />
    </div>
    <div
      v-if="'default' in slots"
      :class="uiStyles.content({ class: props.ui?.content })"
      :style="{ gridArea: 'content' }"
    >
      <slot />
    </div>
    <div
      v-if="'footer' in slots"
      :class="uiStyles.footer({ class: props.ui?.footer })"
      :style="{ gridArea: 'footer' }"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

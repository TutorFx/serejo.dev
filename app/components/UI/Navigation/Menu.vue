<script lang="ts">
export interface NavbarMenuProps {
  direction?: Direction
  size?: ComponentSize
  list: MenuList<FinalRoute>
  class?: any;
}
</script>

<script setup lang="ts">
const props = defineProps<NavbarMenuProps>()

const { t } = useI18n()
const ui = menu({ class: props.class })
</script>

<template>
  <div :class="ui.base( props )">
    <UIButton
      v-for="(item, key) in props.list" :key 
      :to="'to' in item ? item.to : undefined"
      variant="link"
      :size
    >
      {{ t(item.label) }}
    </UIButton>
  </div>
</template>
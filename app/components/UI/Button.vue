<script lang="ts">
import type { RouteLocationRaw } from 'vue-router'
</script>

<script setup lang="ts">
/* eslint-disable ts/no-empty-object-type */
import type { CoreProps } from '@/utils/_core/core.d'

export type ButtonVariantProps = CoreProps & {
  variant?: ButtonVariant
  rounded?: boolean
  block?: boolean
  class?: any
  href?: string
  to?: RouteLocationRaw
  icon?: string
  trailingIcon?: string
  loading?: string | boolean
  download?: string
}

export interface ButtonSlots {
  leading: (props?: {}) => any
  default: (props?: {}) => any
  trailing: (props?: {}) => any
}

const props = withDefaults(defineProps<ButtonVariantProps>(), {
  size: DEFAULT_SIZE,
  color: DEFAULT_COLOR,
  variant: BUTTON_DEFAULT_VARIANT,
  rounded: false,
  block: false,
})

const slots = defineSlots<ButtonSlots>()

const NuxtLink = resolveComponent('NuxtLink')

const ui = button()

const route = useRoute()
const router = useRouter()
const isActive = computed(() => {
  if (!props.to)
    return false

  const resolvedRoute = router.resolve(props.to)
  return route.path === resolvedRoute.path
})

const loading = computed(() => {
  if ('loading' in props && props.loading === true) {
    return true
  }

  return false
})

const icon = computed(() => loading.value ? 'line-md:loading-twotone-loop' : props.icon)
</script>

<template>
  <component
    :is="to || href ? NuxtLink : 'button'"
    :class="ui.base({ ...props, isActive, loading })"
    :to
    :href
    :download
  >
    <div v-if="('leading' in slots) || icon" :class="ui.leading()">
      <slot name="leading">
        <Icon
          v-if="icon"
          :name="icon"
        />
      </slot>
    </div>
    <div v-if="('default' in slots)" class="wrapper" :class="ui.wrapper()">
      <slot />
    </div>
    <div v-if="'trailing' in slots" :class="ui.trailing()">
      <slot name="trailing">
        <Icon
          v-if="trailingIcon"
          :name="trailingIcon"
        />
      </slot>
    </div>
  </component>
</template>

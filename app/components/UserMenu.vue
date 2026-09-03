<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
  collapsed?: boolean
}>()

const { user, clear } = useUserSession()

const items = computed<DropdownMenuItem[][]>(() => ([
  [{
    type: 'label',
    label: user.value?.name || user.value?.username,
    avatar: {
      src: user.value?.avatar,
      alt: user.value?.name || user.value?.username
    }
  }],
  [{
    label: 'Log out',
    icon: 'i-lucide-log-out',
    onSelect() {
      clear()
      refreshNuxtData('chats')
    }
  }]
]))
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'end', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-48 z-2' : 'w-(--reka-dropdown-menu-trigger-width) z-2' }"
  >
    <UButton
      v-bind="{
        label: collapsed ? undefined : (user?.name || user?.username),
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }"
      :avatar="{
        src: user?.avatar || undefined,
        alt: user?.name || user?.username
      }"
      color="neutral"
      variant="ghost"
      size="sm"
      :square="collapsed"
      class="data-[state=open]:bg-elevated cursor-pointer"
      :ui="{
        trailingIcon: 'text-dimmed'
      }"
    />
  </UDropdownMenu>
</template>

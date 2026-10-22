<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const props = defineProps<{
  chatId: string
  title?: string | null
  isOwner: boolean
}>()

const emit = defineEmits<{
  'update:title': [title: string]
  deleted: []
}>()

const { renameChat, deleteChat } = useChatActions()
const { t } = useI18n()

const displayTitle = computed(() => props.title || t('chat.ui.untitled'))

async function rename() {
  const newTitle = await renameChat(props.chatId, props.title)
  if (newTitle) emit('update:title', newTitle)
}

async function remove() {
  if (await deleteChat(props.chatId)) emit('deleted')
}

const items = computed<DropdownMenuItem[][]>(() => [[
  {
    label: t('chat.ui.rename'),
    icon: 'i-lucide-pencil',
    onSelect: rename
  }
], [
  {
    label: t('chat.ui.delete'),
    icon: 'i-lucide-trash',
    color: 'error' as const,
    onSelect: remove
  }
]])
</script>

<template>
  <span v-if="!isOwner" class="text-highlighted block min-w-0 truncate px-2 text-sm font-medium">
    {{ displayTitle }}
  </span>

  <UDropdownMenu v-else :items="items" :content="{ align: 'start' }" :ui="{ content: 'min-w-44' }">
    <UButton
      color="neutral"
      variant="ghost"
      size="sm"
      trailing-icon="i-lucide-chevron-down"
      :label="displayTitle"
      :class="['group data-[state=open]:bg-elevated max-w-full min-w-0', { 'text-muted': !title }]"
      :ui="{
        trailingIcon: 'text-dimmed shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200'
      }"
    />
  </UDropdownMenu>
</template>

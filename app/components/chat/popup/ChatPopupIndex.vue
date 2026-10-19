<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { UIChat } from '~/composables/useChats'
import { getChatErrorKey } from '~/utils/ai/errors'

defineProps<{
  /** Focus the message field on mount (off when a shared link opened the panel) */
  autofocus?: boolean
}>()

const emit = defineEmits<{ openChat: [chatId: string] }>()

const input = ref('')
const loading = ref(false)

const { t } = useI18n()
const toast = useToast()
const { $csrfFetch } = useNuxtApp()
const { loggedIn } = useUserSession()
const { renameChat, deleteChat } = useChatActions()

// Not awaited: the greeting and the message field render at once, the history follows
const { data: chats, refresh: refreshChats } = useFetch('/api/chats', {
  key: 'chats',
  lazy: true,
  transform: (data: Array<{ id: string, title: string | null, createdAt: string }>) => data.map(chat => ({
    id: chat.id,
    label: chat.title || t('chat.ui.untitled'),
    icon: 'i-lucide-message-circle',
    createdAt: chat.createdAt
  }))
})

watch(loggedIn, () => {
  refreshChats()
})

const { groups } = useChats(chats as Ref<UIChat[] | undefined>)

const greeting = useGreeting()

async function createChat(prompt: string) {
  input.value = prompt
  loading.value = true

  const parts = [{ type: 'text', text: prompt }]

  try {
    const chat = await $csrfFetch<{ id: string }>('/api/chats', {
      method: 'POST',
      body: {
        message: {
          role: 'user',
          parts
        }
      }
    })

    refreshNuxtData('chats')
    emit('openChat', chat.id)
  } catch (error) {
    toast.add({
      title: t('chat.ui.create_failed'),
      description: t(getChatErrorKey(error)),
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

async function onSubmit() {
  if (!input.value.trim()) return
  await createChat(input.value)
}

function getChatActions(item: { id: string, label: string }): DropdownMenuItem[][] {
  return [[
    {
      label: t('chat.ui.rename'),
      icon: 'i-lucide-pencil',
      onSelect: () => renameChat(item.id, item.label === t('chat.ui.untitled') ? '' : item.label)
    }
  ], [
    {
      label: t('chat.ui.delete'),
      icon: 'i-lucide-trash',
      color: 'error' as const,
      onSelect: () => deleteChat(item.id)
    }
  ]]
}

const quickChats = QUICK_CHATS
</script>

<template>
  <div
    class="flex min-h-0 flex-1 [scrollbar-width:thin] flex-col gap-5 overflow-y-auto overscroll-contain p-4"
  >
    <!-- Greeting & Input -->
    <div class="flex flex-col gap-3">
      <p class="text-highlighted text-2xl font-bold">
        {{ greeting }}
      </p>

      <UChatPrompt
        v-model="input"
        :status="loading ? 'streaming' : 'ready'"
        :autofocus
        variant="subtle"
        :ui="{ base: 'px-1.5' }"
        :placeholder="t('chat.ui.prompt_placeholder')"
        @submit="onSubmit"
      >
        <template #footer>
          <div class="flex items-center gap-1" />

          <UChatPromptSubmit color="neutral" size="sm" />
        </template>
      </UChatPrompt>

      <!-- Quick prompts -->
      <div class="flex flex-wrap gap-1.5 pt-1">
        <UButton
          v-for="quickChat in quickChats"
          :key="quickChat.key"
          :icon="quickChat.icon"
          :label="t(quickChat.key)"
          size="xs"
          color="neutral"
          variant="outline"
          class="hover:bg-accented/50 cursor-pointer rounded-full"
          @click="createChat(t(quickChat.key))"
        />
      </div>
    </div>

    <!-- History / Past chats -->
    <div v-if="groups?.length" class="flex flex-col gap-3 pt-2">
      <h3
        class="text-dimmed flex items-center justify-between px-1 text-xs font-semibold tracking-wider uppercase"
      >
        <span>{{ t('chat.ui.recent_conversations') }}</span>
        <span class="text-muted text-xs font-normal lowercase">({{ chats?.length ?? 0 }})</span>
      </h3>

      <div class="flex flex-col gap-4">
        <div v-for="group in groups" :key="group.id" class="flex flex-col gap-1">
          <div class="text-dimmed px-2 py-0.5 text-[11px] font-medium">
            {{ group.label }}
          </div>

          <div class="flex flex-col gap-0.5">
            <div
              v-for="chat in group.items"
              :key="chat.id"
              class="group hover:bg-elevated/50 flex items-center justify-between gap-2 rounded-xl pr-1 text-sm transition-colors"
            >
              <button
                type="button"
                class="outline-inverted/25 flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-xl py-2 pl-3 text-left focus-visible:outline-3"
                @click="emit('openChat', chat.id)"
              >
                <UIcon
                  name="i-lucide-message-circle"
                  class="text-dimmed group-hover:text-highlighted size-4 shrink-0 transition-colors"
                />
                <span
                  class="truncate"
                  :class="chat.label === t('chat.ui.untitled') ? 'text-dimmed italic' : 'text-highlighted'"
                >
                  {{ chat.label }}
                </span>
              </button>

              <UDropdownMenu :items="getChatActions(chat)" :content="{ align: 'end' }">
                <!-- Revealed on hover and on keyboard focus -->
                <UButton
                  icon="i-lucide-ellipsis"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  class="rounded-md opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 data-[state=open]:opacity-100"
                  :aria-label="t('chat.ui.chat_actions')"
                />
              </UDropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

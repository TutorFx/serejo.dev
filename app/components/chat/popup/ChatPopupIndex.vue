<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { UIChat } from '~/composables/useChats'

const emit = defineEmits<{ openChat: [chatId: string] }>()

const input = ref('')
const loading = ref(false)

const { user, loggedIn } = useUserSession()
const { renameChat, deleteChat } = useChatActions()

const { data: chats, refresh: refreshChats } = await useFetch('/api/chats', {
  key: 'chats',
  transform: (data: Array<{ id: string, title: string | null, createdAt: string }>) => data.map(chat => ({
    id: chat.id,
    label: chat.title || 'Untitled',
    icon: 'i-lucide-message-circle',
    createdAt: chat.createdAt
  }))
})

watch(loggedIn, () => {
  refreshChats()
})

const { groups } = useChats(chats as Ref<UIChat[] | undefined>)

const greeting = computed(() => {
  const hour = new Date().getHours()
  let timeGreeting = 'Good evening'
  if (hour < 12) timeGreeting = 'Good morning'
  else if (hour < 18) timeGreeting = 'Good afternoon'

  const name = user.value?.name?.split(' ')[0] || user.value?.username

  return name ? `${timeGreeting}, ${name}` : `${timeGreeting}`
})

async function createChat(prompt: string) {
  input.value = prompt
  loading.value = true

  const parts: Array<{ type: string, text?: string, mediaType?: string, url?: string }> = [{ type: 'text', text: prompt }]

  try {
    const chat = await $fetch<{ id: string }>('/api/chats', {
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
      label: 'Rename',
      icon: 'i-lucide-pencil',
      onSelect: () => renameChat(item.id, item.label === 'Untitled' ? '' : item.label)
    }
  ], [
    {
      label: 'Delete',
      icon: 'i-lucide-trash',
      color: 'error' as const,
      onSelect: () => deleteChat(item.id)
    }
  ]]
}

const quickChats = [
  {
    label: 'Why use Nuxt UI?',
    icon: 'i-logos-nuxt-icon'
  },
  {
    label: 'Help me create a Vue composable',
    icon: 'i-logos-vue'
  },
  {
    label: 'Tell me more about UnJS',
    icon: 'i-logos-unjs'
  },
  {
    label: 'Why should I consider VueUse?',
    icon: 'i-logos-vueuse'
  },
  {
    label: 'Tailwind CSS best practices',
    icon: 'i-logos-tailwindcss-icon'
  },
  {
    label: 'Schedule a meeting with Gabriel',
    icon: 'i-lucide-calendar'
  }
]
</script>

<template>
  <div class="flex min-h-0 flex-col gap-5">
    <!-- Greeting & Input -->
    <div class="flex flex-col gap-3">
      <h2 class="text-highlighted text-2xl font-bold">
        {{ greeting }}
      </h2>

      <UChatPrompt
        v-model="input"
        :status="loading ? 'streaming' : 'ready'"
        class="[view-transition-name:chat-prompt]"
        variant="subtle"
        :ui="{ base: 'px-1.5' }"
        placeholder="Ask anything or schedule a meet..."
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
          :key="quickChat.label"
          :icon="quickChat.icon"
          :label="quickChat.label"
          size="xs"
          color="neutral"
          variant="outline"
          class="hover:bg-accented/50 cursor-pointer rounded-full"
          @click="createChat(quickChat.label)"
        />
      </div>
    </div>

    <!-- History / Past chats -->
    <div v-if="groups?.length" class="flex flex-col gap-3 pt-2">
      <div class="text-dimmed flex items-center justify-between px-1 text-xs font-semibold tracking-wider uppercase">
        <span>Recent Conversations</span>
        <span class="text-muted text-xs font-normal lowercase">({{ chats?.length ?? 0 }})</span>
      </div>

      <div class="flex flex-col gap-4">
        <div v-for="group in groups" :key="group.id" class="flex flex-col gap-1">
          <div class="text-dimmed px-2 py-0.5 text-[11px] font-medium">
            {{ group.label }}
          </div>

          <div class="flex flex-col gap-0.5">
            <div
              v-for="chat in group.items"
              :key="chat.id"
              class="group hover:bg-default/80 flex cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition-colors"
              @click="emit('openChat', chat.id)"
            >
              <div class="flex min-w-0 flex-1 items-center gap-2.5">
                <UIcon name="i-lucide-message-circle" class="text-dimmed group-hover:text-highlighted size-4 shrink-0 transition-colors" />
                <span class="truncate" :class="chat.label === 'Untitled' ? 'text-dimmed italic' : 'text-highlighted'">
                  {{ chat.label }}
                </span>
              </div>

              <UDropdownMenu
                :items="getChatActions(chat)"
                :content="{ align: 'end' }"
                :ui="{ content: 'z-2' }"
              >
                <UButton
                  icon="i-lucide-ellipsis"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  class="rounded-md opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Chat actions"
                  @click.stop.prevent
                />
              </UDropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

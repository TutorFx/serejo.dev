<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'

const route = useRoute()
const toast = useToast()

const { data } = await useFetch(`/api/chats/${route.params.id}`, {
  key: `chat-${route.params.id}`,
  cache: 'force-cache'
})

const isOwner = computed(() => data.value?.isOwner ?? false)
const visibility = ref<'public' | 'private'>(data.value?.visibility ?? 'private')
const title = ref<string | null>(data.value?.title ?? null)

watch(() => data.value?.title, (next) => {
  title.value = next ?? null
})

const input = ref('')

const chat = new Chat({
  id: data.value?.id,
  messages: data.value?.messages,
  transport: new DefaultChatTransport({
    api: `/api/chats/${data.value?.id}`
  }),
  onData: async (dataPart) => {
    if (dataPart.type === 'data-chat-title') {
      await refreshNuxtData('chats')
      const chatsCache = useNuxtData<{ id: string, label: string }[]>('chats')
      const updated = chatsCache.data.value?.find(c => c.id === data.value?.id)
      if (updated && updated.label !== 'Untitled') {
        title.value = updated.label
      }
    }
  },
  onError(error) {
    let message = error.message
    if (typeof message === 'string' && message[0] === '{') {
      try {
        message = JSON.parse(message).message || message
      } catch {
        // keep original message on malformed JSON
      }
    }

    toast.add({
      description: message,
      icon: 'i-lucide-alert-circle',
      color: 'error',
      duration: 0
    })
  }
})

async function handleSubmit(e: Event) {
  e.preventDefault()
  if (input.value.trim()) {
    chat.sendMessage({
      text: input.value
    })
    input.value = ''
  }
}

onMounted(() => {
  if (isOwner.value && data.value?.messages.length === 1) {
    chat.regenerate()
  }
})
</script>

<template>
  <UDashboardPanel
    v-if="data?.id"
    id="chat"
    class="relative min-h-0"
    :ui="{ body: 'p-0 sm:p-0 overscroll-none' }"
  >
    <template #header>
      <UDashboardNavbar>
        <template #title>
          <ChatTitle
            :chat-id="data!.id"
            :title="title"
            :is-owner="isOwner"
            @update:title="title = $event"
          />
        </template>

        <template #right>
          <ChatVisibility
            v-if="isOwner"
            :chat-id="data!.id"
            :visibility="visibility"
            @update:visibility="visibility = $event"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div ref="dropzoneRef" class="flex flex-1">
        <UContainer class="flex flex-1 flex-col gap-4 sm:gap-6">
          <UChatMessages
            should-auto-scroll
            :messages="chat.messages"
            :status="chat.status"
            :spacing-offset="isOwner ? 160 : 0"
            class="pt-(--ui-header-height) pb-4 sm:pb-6"
          >
            <template #indicator>
              <div class="flex items-center gap-1.5">
                <ChatIndicator />

                <UChatShimmer text="Thinking..." class="text-sm" />
              </div>
            </template>

            <template #content="{ message }">
              <ChatMessageContent
                :message="message"
              />
            </template>

            <template v-if="isOwner" #actions="{ message }">
              <ChatMessageActions
                :message="message"
                :streaming="chat.status === 'streaming' && message.id === chat.messages[chat.messages.length - 1]?.id"
              />
            </template>
          </UChatMessages>

          <UChatPrompt
            v-if="isOwner"
            v-model="input"
            :error="chat.error"
            variant="subtle"
            class="sticky bottom-0 z-10 rounded-b-none [view-transition-name:chat-prompt]"
            :ui="{ base: 'px-1.5' }"
            @submit="handleSubmit"
          >
            <template #footer>
              <div class="flex items-center gap-1" />

              <UChatPromptSubmit
                :status="chat.status"
                color="neutral"
                size="sm"
                @stop="chat.stop()"
              />
            </template>
          </UChatPrompt>
        </UContainer>
      </div>
    </template>
  </UDashboardPanel>

  <UContainer v-else class="flex flex-1 flex-col gap-4 sm:gap-6">
    <UError :error="{ statusMessage: 'Chat not found', statusCode: 404 }" class="min-h-full" />
  </UContainer>
</template>

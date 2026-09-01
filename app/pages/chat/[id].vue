<script setup lang="ts">
import type { UIMessage } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'

const route = useRoute()
const toast = useToast()
const { loggedIn, openInPopup } = useUserSession()

function login() {
  openInPopup('/sso/github')
}

const { data } = await useFetch(`/api/chats/${route.params.id}`, {
  key: `chat-${route.params.id}`,
  cache: 'force-cache'
})

const { data: votes } = await useLazyFetch<Array<{ chatId: string, messageId: string, isUpvoted: boolean }>>(`/api/chats/${route.params.id}/votes`, {
  key: `chat-${route.params.id}-votes`,
  default: () => []
})

function getVote(messageId: string) {
  const vote = votes.value?.find(v => v.messageId === messageId)
  if (!vote) return null
  return !!vote.isUpvoted
}

async function vote(message: UIMessage, isUpvoted: boolean) {
  const snapshot = (votes.value ?? []).map(v => ({ ...v }))
  const toggling = getVote(message.id) === isUpvoted
  const next = toggling ? null : isUpvoted

  votes.value = next === null
    ? (votes.value ?? []).filter(v => v.messageId !== message.id)
    : [
      ...(votes.value ?? []).filter(v => v.messageId !== message.id),
      { chatId: route.params.id as string, messageId: message.id, isUpvoted: next }
    ]

  try {
    await $fetch(`/api/chats/${route.params.id}/votes`, {
      method: 'POST',
      body: next === null ? { messageId: message.id } : { messageId: message.id, isUpvoted: next }
    })
  } catch {
    votes.value = snapshot
    toast.add({
      description: 'Failed to save vote',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  }
}

const isOwner = computed(() => data.value?.isOwner ?? false)
const title = ref<string | null>(data.value?.title ?? null)
const visibility = ref<'public' | 'private'>(data.value?.visibility ?? 'private')

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
  <div class="relative flex min-h-0 flex-1 flex-col">
    <UDashboardPanel
      v-if="data?.id"
      id="chat"
      class="relative min-h-0 flex-1"
      :ui="{ body: 'p-0 sm:p-0' }"
    >
      <template #header>
        <Navbar>
          <template #title>
            <ChatTitle
              :chat-id="data.id"
              :title="title"
              :is-owner="isOwner"
              @update:title="title = $event"
            />
          </template>

          <template #right>
            <ChatVisibility
              v-if="isOwner"
              :chat-id="data.id"
              :visibility="visibility"
              @update:visibility="visibility = $event"
            />

            <UserMenu v-if="loggedIn" />
            <UButton
              v-else
              label="Login with GitHub"
              icon="i-simple-icons-github"
              size="xs"
              variant="soft"
              color="neutral"
              class="cursor-pointer"
              @click="login"
            />
          </template>
        </Navbar>
      </template>

      <template #body>
        <div class="flex flex-1">
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
                  :vote="getVote(message.id)"
                  @vote="(_message, isUpvoted) => vote(_message, isUpvoted)"
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
  </div>
</template>

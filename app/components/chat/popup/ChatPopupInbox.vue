<script setup lang="ts">
import type { UIMessage } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai'
import { getChatErrorKey } from '~/utils/ai/errors'
import { createChatTransport } from '~/utils/ai/transport'

const props = defineProps<{
  id: string
  /** Focus the message field on mount (off when a shared link opened the panel) */
  autofocus?: boolean
}>()

const emit = defineEmits<{
  back: []
  deleted: []
  /** The chat does not exist, is private or failed to load: the popup goes back to the list */
  unavailable: [statusCode?: number]
}>()

const toast = useToast()
const { t } = useI18n()
const { $csrfFetch } = useNuxtApp()

const { data, error } = await useFetch(`/api/chats/${props.id}`, {
  key: `chat-${props.id}`,
  cache: 'force-cache'
})

const isOwner = computed(() => data.value?.isOwner ?? false)

// Votes are only readable by the owner: visitors of a shared chat would get a 404
const { data: votes } = await useLazyFetch<Array<{ chatId: string, messageId: string, isUpvoted: boolean }>>(`/api/chats/${props.id}/votes`, {
  key: `chat-${props.id}-votes`,
  default: () => [],
  immediate: isOwner.value
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
      { chatId: props.id, messageId: message.id, isUpvoted: next }
    ]

  try {
    await $csrfFetch(`/api/chats/${props.id}/votes`, {
      method: 'POST',
      body: next === null ? { messageId: message.id } : { messageId: message.id, isUpvoted: next }
    })
  } catch {
    votes.value = snapshot
    toast.add({
      description: t('chat.ui.vote_failed'),
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  }
}

const title = ref<string | null>(data.value?.title ?? null)
const visibility = ref<'public' | 'private'>(data.value?.visibility ?? 'private')

watch(() => data.value?.title, (next) => {
  title.value = next ?? null
})

const input = ref('')

const chat = new Chat({
  id: data.value?.id,
  messages: data.value?.messages,
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  // Sends only the new message or the approval decisions; the server rebuilds the history
  transport: createChatTransport(props.id),
  onData: async (dataPart) => {
    if (dataPart.type === 'data-chat-title') {
      await refreshNuxtData(`chat-${props.id}`)
    }
  },
  onError(error) {
    // Only translated messages: server and provider details are never shown
    toast.add({
      description: t(getChatErrorKey(error)),
      icon: 'i-lucide-alert-circle',
      color: 'error',
      duration: 0
    })
    // Rate limits and busy chats are recoverable: keep the prompt usable.
    // `onError` runs before the chat switches to the error status, so clear it on the next tick
    setTimeout(() => chat.clearError(), 0)
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
  if (!data.value) {
    emit('unavailable', error.value?.statusCode)
    return
  }

  if (isOwner.value && data.value.messages.length === 1) {
    chat.regenerate()
  }
})
</script>

<template>
  <div v-if="data" class="flex min-h-0 flex-1 flex-col">
    <div class="border-default flex shrink-0 items-center gap-1 border-b px-2 py-1.5">
      <UButton
        icon="i-lucide-chevron-left"
        color="neutral"
        variant="ghost"
        size="sm"
        :aria-label="t('chat.ui.back_to_list')"
        @click="emit('back')"
      />

      <div class="min-w-0 flex-1">
        <ChatTitle
          :chat-id="data.id"
          :title="title"
          :is-owner="isOwner"
          @update:title="title = $event"
          @deleted="emit('deleted')"
        />
      </div>

      <ChatVisibility
        v-if="isOwner"
        :chat-id="data.id"
        :visibility="visibility"
        @update:visibility="visibility = $event"
      />
    </div>

    <div class="min-h-0 flex-1 [scrollbar-width:thin] overflow-y-auto overscroll-contain px-4">
      <UChatMessages
        should-auto-scroll
        :auto-scroll="false"
        :messages="chat.messages"
        :status="chat.status"
        class="py-4"
      >
        <template #indicator>
          <div class="flex items-center gap-1.5">
            <ChatIndicator />

            <UChatShimmer :text="t('chat.ui.thinking')" class="text-sm" />
          </div>
        </template>

        <template #content="{ message }">
          <ChatMessageContent
            :message="message"
            @approve="chat.addToolApprovalResponse({ id: $event, approved: true })"
            @deny="chat.addToolApprovalResponse({ id: $event, approved: false })"
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
    </div>

    <div v-if="isOwner" class="shrink-0 px-3 pb-3">
      <UChatPrompt
        v-model="input"
        :error="chat.error"
        :autofocus
        :placeholder="t('chat.ui.prompt_placeholder')"
        variant="subtle"
        :ui="{ base: 'pl-1.5' }"
        @submit="handleSubmit"
      >
        <template #footer>
          <div class="flex items-center gap-1" />

          <UChatPromptSubmit :status="chat.status" color="neutral" size="sm" @stop="chat.stop()" />
        </template>
      </UChatPrompt>
    </div>
  </div>
</template>

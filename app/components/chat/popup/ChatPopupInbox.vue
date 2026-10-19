<script setup lang="ts">
import type { UIMessage } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai'
import { getChatErrorKey } from '~/utils/ai/errors'
import { createChatTransport } from '~/utils/ai/transport'

const props = defineProps<{ id: string }>()
const toast = useToast()
const { t } = useI18n()
const { $csrfFetch } = useNuxtApp()

const { data } = await useFetch(`/api/chats/${props.id}`, {
  key: `chat-${props.id}`,
  cache: 'force-cache'
})

const { data: votes } = await useLazyFetch<Array<{ chatId: string, messageId: string, isUpvoted: boolean }>>(`/api/chats/${props.id}/votes`, {
  key: `chat-${props.id}-votes`,
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

const isOwner = computed(() => data.value?.isOwner ?? false)
const title = ref<string | null>(data.value?.title ?? null)

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
  if (isOwner.value && data.value?.messages.length === 1) {
    chat.regenerate()
  }
})
</script>

<template>
  <div class="grid">
    <div
      v-if="data?.id"
      id="chat"
      class="grid grid-rows-[max-content_1fr]"
      :ui="{ body: 'p-0 sm:p-0' }"
    >
      <div>
        <slot :title />
      </div>
      <!-- <template #header>
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
      </template> -->

      <div class="relative grid min-h-0">
        <div
          class="
            [&::-webkit-scrollbar]:bg-base-200/0
            [&::-webkit-scrollbar]:border-base-200/0
            [&::-webkit-scrollbar-track]:bg-base-200/0
            [&::-webkit-scrollbar-thumb]:border-accent
            [&::-webkit-scrollbar-thumb]:bg-accent
            absolute
            inset-0
            overflow-y-auto
            p-4
            [&::-webkit-scrollbar]:size-3
            [&::-webkit-scrollbar]:border-b-10
            [&::-webkit-scrollbar-thumb]:rounded-xl
            [&::-webkit-scrollbar-thumb]:border-6
            [&::-webkit-scrollbar-track]:rounded-xl
          "
        >
          <div class="flex flex-1">
            <div class="flex flex-1 flex-col gap-4 sm:gap-6">
              <UChatMessages
                should-auto-scroll
                :auto-scroll="false"
                :messages="chat.messages"
                :status="chat.status"
                :spacing-offset="isOwner ? 160 : 0"
                class="pt-(--ui-header-height) pb-4 sm:pb-6"
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

              <UChatPrompt
                v-if="isOwner"
                v-model="input"
                :error="chat.error"
                variant="subtle"
                class="sticky bottom-0 z-10 rounded-b-none [view-transition-name:chat-prompt]"
                :ui="{ base: 'pl-1.5' }"
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <UContainer v-else class="flex flex-1 flex-col gap-4 sm:gap-6">
      <UError
        :error="{ statusMessage: t('chat.ui.not_found'), statusCode: 404 }"
        class="min-h-full"
      />
    </UContainer>
  </div>
</template>

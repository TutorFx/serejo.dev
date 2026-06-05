<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'

const props = defineProps<{ id: string }>()
const toast = useToast()

const { data } = await useFetch(`/api/chats/${props.id}`, {
  key: `chat-${props.id}`,
  cache: 'force-cache'
})

const isOwner = computed(() => data.value?.isOwner ?? false)
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
      await refreshNuxtData(`chat-${props.id}`)
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
          [&::-webkit-scrollbar-thumb]:border-base-200
          [&::-webkit-scrollbar-thumb]:bg-accent
          absolute
          inset-0
          overflow-y-auto
          [&::-webkit-scrollbar]:size-6
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
      <UError :error="{ statusMessage: 'Chat not found', statusCode: 404 }" class="min-h-full" />
    </UContainer>
  </div>
</template>

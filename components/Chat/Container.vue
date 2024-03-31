<script setup lang="ts" generic="T extends Message<User & Bot>">
import type Message from '@/utils/chat/entities/Message'
import type Bot from '@/utils/chat/entities/Agent/Bot'
import type User from '@/utils/chat/entities/Agent/User'

const chat = getChat()
const message = ref('')

async function sendMessage() {
  if (!message.value)
    return
  await chat.sendMessage(message.value)
  message.value = ''
}

const list = ref<HTMLElement>()

watch(() => chat.messageRepository.messages, () => {
  nextTick(() => list.value?.scrollTo(0, list.value.scrollHeight))
}, { deep: true })
</script>

<template>
  <div class="grid rounded-lg overflow-hidden bg-white shadow-xl grid-rows-[1fr_max-content] h-[65vh] max-w-full">
    <div ref="list" class="overflow-auto">
      <div class="grid p-4 gap-3 items-start">
        <!-- Comment Zone -->
        <TransitionGroup>
          <ChatMessage v-for="(value, i) in chat.getMessages()" :key="i" :value="value" />
        </TransitionGroup>
      </div>
    </div>

    <div class="p-4 bg-gray-300">
      <input
        v-model="message" class="flex items-center w-full px-3 text-sm h-10 rounded" type="text"
        placeholder="Type your message…" @keydown.enter="sendMessage"
      >
    </div>
  </div>
</template>

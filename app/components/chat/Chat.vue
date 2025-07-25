<script setup lang="ts">
const { data } = useFetch<MessageType[]>('/api/chat')

const { messages, stream, model, status, sendMessage } = useChat()

watch(data, (chatRes) => {
  if (chatRes) {
    messages.value = chatRes
  }
}, { immediate: true })
</script>

<template>
  <UIChat v-model="model" :messages :stream :status @message="sendMessage" />
</template>

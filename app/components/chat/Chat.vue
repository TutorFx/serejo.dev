<script setup lang="ts">
  const { messages, stream, model, status, sendMessage } = useChat()
</script>

<template>
  <UIChat :messages :stream :status v-model="model" @message="sendMessage"/>
</template>
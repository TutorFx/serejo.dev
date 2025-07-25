<script lang="ts">
export type ChatMessage = {
  agentType: 'model'
  agent: AiAgentTypes
  message: string
} | {
  agentType: 'user'
  message: string
}

export interface ChatMessageProps {
  value: ChatMessage
  streaming?: boolean
}
</script>

<script setup lang="ts">
const props = defineProps<ChatMessageProps>()
const ui = genericChatMessage()
</script>

<template>
  <div :class="ui.base({ variant: props.value.agentType })">
    <MDC :class="ui.content()" :value="props.value.message" />
  </div>
</template>

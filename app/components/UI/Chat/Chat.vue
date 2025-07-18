<script lang="ts">
import type { ChatContainerProps, ChatContainerEmits } from './ChatContainer.vue';

export interface ChatProps extends ChatContainerProps {
  agent?: never
}

export interface ChatEmits extends ChatContainerEmits {}

</script>

<script setup lang="ts">
import { onClickOutside, useScrollLock } from '@vueuse/core'

const props = defineProps<ChatProps>()
const model = defineModel<string>()
const agent = defineModel<AiAgentTypes>('agent')
const emits = defineEmits<ChatEmits>()

const chat = useScrollLock(document?.body ?? null)

const target = ref()
const button = ref()


onClickOutside(target, () => chat.value ? chat.value = false : null, {
  ignore: [button],
})
</script>

<template>
  <div class="grid justify-end items-end fixed inset-0 p-3 z-50 pointer-events-none">
    <div class="grid gap-3">
      <div class="grid">
        <Transition
          enter-from-class="translate-y-[150%]"
          enter-active-class="transition duration-500"
          leave-active-class="translate-y-[200%] duration-500"
        >
          <UIChatContainer v-show="chat" ref="target" :stream :messages :status :agent="agent" v-model="model" @message="(message) => emits('message', message)" />
        </Transition>
      </div>
      <div ref="button" class="grid justify-end">
        <div class="size-12 grid items-center justify-center pointer-events-auto rounded-full overflow-hidden bg-base-300 aspect-square cursor-pointer shadow-xl" @click="chat = !chat">
          <Icon class="size-10 animate-[spin_10s_linear_infinite]" name="material-icon-theme:gemini-ai" />
        </div>
      </div>
    </div>
  </div>
</template>
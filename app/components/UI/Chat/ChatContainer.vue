<script lang="ts">
export interface ChatContainerProps {
  messages: MessageType[]
  stream: string
  class?: any
  agent?: AiAgentTypes
  status?: MessageStatus
}
export interface ChatContainerEmits {
  message: [value: string | undefined]
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<ChatContainerProps>(), { agent: AI_AGENT.FELINA })

const emits = defineEmits<ChatContainerEmits>()

const ui = genericChat()

const model = defineModel<string>()

const list = useTemplateRef('list')
const end = useTemplateRef('end')

const isBlocked = computed(() =>
  !([MESSAGE_STATUS.ERROR, MESSAGE_STATUS.IDLE] as (MessageStatus | undefined)[])
    .includes(props.status),
)

function scrollDown() {
  if (end.value) {
    end.value.scrollIntoView({ behavior: 'smooth' })
  }
}

watch(() => props.messages, () => {
  nextTick(() => scrollDown())
})

watch(() => props.stream.length, () => {
  setTimeout(() => {
    scrollDown()
  }, 100)
})

function sendMessage() {
  if (isBlocked.value)
    return

  scrollDown()
  emits('message', model.value)
}
</script>

<template>
  <div
    :class="ui.base()"
  >
    <div :class="ui.header()">
      <div class="relative">
        <NuxtImg width="64" src="/felina/chat.jpg" class="rounded-full mx-auto" />
        <div class="absolute rounded-lg top-0 aspect-square right-0 w-5 bg-emerald-300 border-4 border-base-100" />
      </div>
      <div>
        <div class="text-xl">
          Felina
        </div>
        <div class="text-sm">
          {{ $t('chat.reply_in_second') }}
        </div>
      </div>
    </div>
    <div
      ref="list"
      :class="ui.content()"
      class="
      [&::-webkit-scrollbar]:size-6
      [&::-webkit-scrollbar]:bg-base-300
      [&::-webkit-scrollbar]:border-b-10
      [&::-webkit-scrollbar]:border-base-300

      [&::-webkit-scrollbar-track]:bg-base-300
      [&::-webkit-scrollbar-track]:rounded-xl

      [&::-webkit-scrollbar-thumb]:border-6
      [&::-webkit-scrollbar-thumb]:border-base-300
      [&::-webkit-scrollbar-thumb]:bg-base-100
      [&::-webkit-scrollbar-thumb]:rounded-xl

      grid
      items-start
      "
    >
      <div class="grid p-4 gap-3 items-start">
        <div class="bg-base-200 p-3 rounded-lg">
          {{ $t('chat.talk_to_cat') }}
        </div>
        <UIChatMessage v-for="(value, i) in messages" :key="i" :value="value" />
        <UIChatMessage v-if="props.stream" :value="{ message: props.stream, agentType: AGENT_TYPE.AI, agent: props.agent }" />
        <div ref="end" />
      </div>
    </div>

    <div :class="ui.footer()">
      <div class="flex gap-3">
        <input
          v-model="model" autocomplete="off" name="ai-message" class="flex-1 text-sm flex items-center w-full px-3 bg-base-100 h-10 rounded outline-none"
          type="textarea" :placeholder="$t('chat.input_label')" @keydown.enter="sendMessage"
        >
        <UIButton :loading="isBlocked" icon="material-symbols:send-rounded" @click="sendMessage" />
      </div>
    </div>
  </div>
</template>

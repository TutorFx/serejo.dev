<script setup lang="ts" generic="T extends Message<User & Bot>">
import gsap from 'gsap'

import type Message from '../../utils/chat/entities/Message'
import type Bot from '../../utils/chat/entities/Agent/Bot'
import type User from '../../utils/chat/entities/Agent/User'

const chat = getChat()
const message = ref('')

async function sendMessage() {
  if (!message.value)
    return
  chat.sendMessage(message.value)
  message.value = ''
}

const list = ref<HTMLElement>()

const scrollDown = () => list.value?.scrollTo(0, list.value.scrollHeight)

const messages = computed(() => chat.getMessages())

function onBeforeEnter(el: any) {
  scrollDown()
  el.style.opacity = 0
  el.style.height = 0
}

function onEnter(el: any, done: any) {
  scrollDown()
  gsap.to(el, {
    opacity: 1,
    height: 'auto',
    delay: el.dataset.index * 0.15,
    onComplete: done,
  })
}
</script>

<template>
  <div
    class="grid rounded-lg overflow-hidden bg-base-300 grid-rows-[max-content_1fr_max-content] shadow-xl max-h-[65vh]"
  >
    <div class="p-4 grid gap-3 items-center bg-blue-600 text-white grid-cols-[max-content_1fr]">
      <div class="relative">
        <NuxtImg width="64" src="/felina/chat.jpg" class="rounded-full mx-auto" />
        <div class="absolute rounded-full top-0 aspect-square right-0 w-5 bg-emerald-300 border-2 border-blue-600" />
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
    <div ref="list" class="overflow-auto">
      <div v-if="messages.length > 0" class="grid p-4 gap-3 items-start max-w-xs">
        <!-- Comment Zone -->
        <TransitionGroup :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @after-enter="scrollDown">
          <ChatMessage v-for="(value, i) in messages" :key="i" :value="value" />
        </TransitionGroup>
      </div>
      <div v-else class="grid p-4 py-12 text-center max-w-xs text-sm gap-3">
        {{ $t('chat.talk_to_cat') }}
      </div>
    </div>

    <div class="p-4 border-t border-t-base-100">
      <input
        v-model="message" class="text-sm flex items-center w-full px-3 bg-base-100 h-10 rounded outline-none"
        type="text" :placeholder="$t('chat.input_label')" @keydown.enter="sendMessage"
      >
    </div>
  </div>
</template>

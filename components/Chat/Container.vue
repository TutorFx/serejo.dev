<script setup lang="ts" generic="T extends Message<User & Bot>">
import gsap from 'gsap'

import type Message from '@/utils/chat/entities/Message'
import type Bot from '@/utils/chat/entities/Agent/Bot'
import type User from '@/utils/chat/entities/Agent/User'

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
    class="bg-base-300 grid grid-rows-[max-content_1fr_max-content] max-h-[65vh] overflow-hidden rounded-lg shadow-xl"
  >
    <div class="grid grid-cols-[max-content_1fr] items-center gap-3 bg-blue-600 p-4 text-white">
      <div class="relative">
        <NuxtImg width="64" src="/felina/chat.jpg" class="mx-auto rounded-full" />
        <div class="absolute right-0 top-0 aspect-square w-5 border-2 border-blue-600 rounded-full bg-emerald-300" />
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
      <div v-if="messages.length > 0" class="grid max-w-xs items-start gap-3 p-4">
        <!-- Comment Zone -->
        <TransitionGroup :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @after-enter="scrollDown">
          <ChatMessage v-for="(value, i) in messages" :key="i" :value="value" />
        </TransitionGroup>
      </div>
      <div v-else class="grid max-w-xs gap-3 p-4 py-12 text-center text-sm">
        {{ $t('chat.talk_to_cat') }}
      </div>
    </div>

    <div class="border-t-base-100 border-t p-4">
      <input
        v-model="message" class="bg-base-100 h-10 w-full flex items-center rounded px-3 text-sm outline-none"
        type="text" :placeholder="$t('chat.input_label')" @keydown.enter="sendMessage"
      >
    </div>
  </div>
</template>

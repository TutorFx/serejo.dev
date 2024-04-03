<script setup lang="ts">
const chat = useScrollLock(document?.body)
const target = ref()
const button = ref()

onClickOutside(target, () => chat.value ? chat.value = false : null, {
  ignore: [button],
})
</script>

<template>
  <div class="grid justify-end items-end fixed inset-0 p-3 pointer-events-none z-[3]">
    <div class="grid gap-3">
      <div class="grid">
        <Transition
          enter-from-class="translate-y-[150%]"
          enter-active-class="transition duration-500"
          leave-active-class="translate-y-[200%] duration-500"
        >
          <ChatContainer v-show="chat" ref="target" class="grid pointer-events-auto" />
        </Transition>
      </div>
      <div ref="button" class="grid justify-end">
        <div class="pointer-events-auto rounded-full bg-base-300 aspect-square cursor-pointer overflow-hidden shadow-xl" @click="chat = !chat">
          <NuxtImg width="64" src="/felina/robot.jpg"/>
        </div>
      </div>
    </div>
  </div>
</template>

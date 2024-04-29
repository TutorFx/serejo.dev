<script setup lang="ts">
const chat = useScrollLock(document?.body)
const target = ref()
const button = ref()

onClickOutside(target, () => chat.value ? chat.value = false : null, {
  ignore: [button],
})
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-[4] grid items-end justify-end p-3">
    <div class="grid gap-3">
      <div class="grid">
        <Transition
          enter-from-class="translate-y-[150%]"
          enter-active-class="transition duration-500"
          leave-active-class="translate-y-[200%] duration-500"
        >
          <ChatContainer v-show="chat" ref="target" class="pointer-events-auto grid" />
        </Transition>
      </div>
      <div ref="button" class="grid justify-end">
        <div v-hoverable:chat class="bg-base-300 pointer-events-auto aspect-square cursor-pointer overflow-hidden rounded-full shadow-xl" @click="chat = !chat">
          <NuxtImg width="64" src="/felina/robot.jpg" />
        </div>
      </div>
    </div>
  </div>
</template>

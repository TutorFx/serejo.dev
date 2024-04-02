<script setup lang="ts">
const chat = ref(false)
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
          <ChatContainer v-show="chat" class="grid pointer-events-auto" />
        </Transition>
      </div>
      <div class="grid justify-end">
        <div class="pointer-events-auto rounded-full bg-base-300 p-4 aspect-square" @click="chat = !chat">
          <Icon size="32" name="material-symbols:robot-outline" />
        </div>
      </div>
    </div>
  </div>
</template>

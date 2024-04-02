<script setup lang="ts">
const chat = ref(true)
</script>

<template>
  <div class="grid p-3 justify-end fixed pointer-events-none inset-0 items-end z-[3]">
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
        <div class="pointer-events-auto aspect-square p-4 rounded-full bg-base-300" @click="chat = !chat">
          <Icon size="32" name="material-symbols:robot-outline" />
        </div>
      </div>
    </div>
  </div>
</template>

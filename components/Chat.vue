<script setup lang="ts">
const chat = ref(true)
</script>

<template>
  <div class="fixed pointer-events-none inset-0 grid items-end p-3 z-[3] md:justify-end">
    <div class="grid gap-3 min-w-[500px] max-w-2xl">
      <div class="grid">
        <Transition>
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

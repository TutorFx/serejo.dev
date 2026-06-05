<script setup lang="ts">
const isOpen = ref(false)

function toggle() {
  if (!document.startViewTransition) {
    isOpen.value = !isOpen.value
    return
  }

  document.startViewTransition(async () => {
    isOpen.value = !isOpen.value
    await nextTick()
  })
}

const currentChatId = ref<string | null>(null)
</script>

<template>
  <ClientOnly>
    <Teleport id="chat-popup" to="body">
      <div v-if="isOpen" class="fixed bottom-8 left-8 z-1000 h-full max-h-[70px] w-full max-w-[70px] [view-transition-name:chat-handle]" @click="toggle()">
        <LazyUIFluidOrb class="[view-transition-name:chat-popup]" :scale="1.6" />
      </div>
      <div v-else-if="currentChatId !== null" class="fixed bottom-0 left-0 z-1000 grid">
        <div class="bg-base-200/80 relative grid h-[min(100dvh,800px)] w-[min(100dvw,600px)] rounded-3xl p-2 backdrop-blur-lg [view-transition-name:chat-handle]">
          <ChatPopupInbox :id="currentChatId">
            <template #default="{ title }">
              <div class="flex justify-between">
                <div class="p-3 text-xl font-semibold">
                  {{ title ?? 'Untitled' }}
                </div>
                <div class="grid aspect-square h-8 w-8 items-center justify-center rounded-full p-2" @click="currentChatId = null">
                  <Icon size="30" name="mdi:chevron-left" />
                </div>
              </div>
            </template>
          </ChatPopupInbox>
        </div>
      </div>
      <div v-else class="fixed bottom-0 left-0 z-1000 grid">
        <div class="bg-base-200/80 relative grid h-[min(100dvh,800px)] w-[min(100dvw,600px)] grid-rows-[max-content_1fr_max-content] overflow-hidden rounded-3xl p-2 backdrop-blur-lg [view-transition-name:chat-handle]">
          <div class="absolute inset-0 top-64">
            <div class="relative grid">
              <div class="absolute inset-0 grid overflow-hidden">
                <LazyUIFluidOrb class="[view-transition-name:chat-popup]" :scale="1.6" />
              </div>
              <div class="from-base-200/0 to-base-200 relative top-0 bg-linear-to-b pt-[50%]">
                <div class="from-base-200/0 to-base-200 relative top-0 mt-[50%] grid bg-linear-to-b pt-[50%]" />
              </div>
            </div>
          </div>
          <div class="flex justify-between">
            <div class="p-3 text-xl font-semibold">
              Serejo Chat
            </div>
            <div class="grid aspect-square h-8 w-8 items-center justify-center rounded-full p-2" @click="toggle()">
              <Icon name="mdi:close" />
            </div>
          </div>
          <div class="grid gap-2 p-4">
            <ChatPopupIndex @open-chat="currentChatId = $event" />
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

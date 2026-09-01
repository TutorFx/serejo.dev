<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const isOpen = ref(false)
const currentChatId = ref<string | null>(null)
const popup = useTemplateRef<HTMLElement>('popup')

const { loggedIn, openInPopup } = useUserSession()

function login() {
  openInPopup('/sso/github')
}

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

onClickOutside(popup, () => {
  if (!isOpen.value) {
    toggle()
  }
})
</script>

<template>
  <ClientOnly>
    <Teleport id="chat-popup" to="body">
      <!-- Floating Trigger Button -->
      <div
        v-if="isOpen"
        class="fixed bottom-8 left-8 z-1 cursor-pointer [view-transition-name:chat-handle]"
        @click="toggle()"
      >
        <button
          type="button"
          class="bg-primary text-primary-foreground hover:bg-primary/90 flex size-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          aria-label="Open chat"
        >
          <UIcon name="i-lucide-message-circle" class="size-7" />
        </button>
      </div>

      <!-- Chat Inbox View -->
      <div v-else-if="currentChatId !== null" ref="popup" class="fixed bottom-0 left-0 z-1 grid">
        <div class="bg-base-200/80 relative grid h-[min(100dvh,800px)] w-[min(100dvw,600px)] rounded-3xl p-2 backdrop-blur-lg [view-transition-name:chat-handle]">
          <ChatPopupInbox :id="currentChatId" :key="currentChatId">
            <template #default="{ title }">
              <div class="flex items-center justify-between">
                <div class="p-3 text-xl font-semibold">
                  {{ title ?? 'Untitled' }}
                </div>
                <div
                  class="grid aspect-square size-8 cursor-pointer items-center justify-center rounded-full p-2 hover:bg-neutral-500/10"
                  @click="currentChatId = null"
                >
                  <UIcon name="i-lucide-chevron-left" />
                </div>
              </div>
            </template>
          </ChatPopupInbox>
        </div>
      </div>

      <!-- Chat Index View -->
      <div v-else-if="currentChatId === null" ref="popup" class="fixed bottom-0 left-0 z-1 grid">
        <div class="bg-base-200/80 relative grid h-[min(100dvh,800px)] w-[min(100dvw,600px)] grid-rows-[max-content_1fr] overflow-hidden rounded-3xl p-2 backdrop-blur-lg [view-transition-name:chat-handle]">
          <div class="z-1 flex items-center justify-between p-2">
            <div class="flex items-center gap-2 p-2 text-xl font-semibold">
              <UIcon name="i-lucide-bot" class="text-primary size-6" />
              <span>Serejo Chat</span>
            </div>
            <div class="flex items-center gap-2">
              <UserMenu v-if="loggedIn" />
              <UButton
                v-else
                label="Login"
                icon="i-simple-icons-github"
                size="xs"
                variant="soft"
                color="neutral"
                class="cursor-pointer"
                @click="login"
              />
              <div
                class="grid aspect-square size-8 cursor-pointer items-center justify-center rounded-full p-2 hover:bg-neutral-500/10"
                @click="toggle()"
              >
                <UIcon name="i-lucide-x" />
              </div>
            </div>
          </div>
          <div class="relative grid min-h-0">
            <div
              class="
              [&::-webkit-scrollbar]:bg-base-200/0
              [&::-webkit-scrollbar]:border-base-200/0
              [&::-webkit-scrollbar-track]:bg-base-200/0
              [&::-webkit-scrollbar-thumb]:border-accent
              [&::-webkit-scrollbar-thumb]:bg-accent
              absolute
              inset-0
              overflow-y-auto
              p-4
              [&::-webkit-scrollbar]:size-3
              [&::-webkit-scrollbar]:border-b-10
              [&::-webkit-scrollbar-thumb]:rounded-xl
              [&::-webkit-scrollbar-thumb]:border-6
              [&::-webkit-scrollbar-track]:rounded-xl
            "
            >
              <ChatPopupIndex @open-chat="currentChatId = $event" />
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

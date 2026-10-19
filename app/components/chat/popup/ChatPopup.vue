<script setup lang="ts">
const { t } = useI18n()
const toast = useToast()

// Closed on every page load: the panel only opens on a click
const open = ref(false)
const currentChatId = ref<string | null>(null)

function onUnavailable(statusCode?: number) {
  currentChatId.value = null
  toast.add({
    title: t('chat.ui.unavailable_title'),
    description:
      statusCode === 404 ? t('chat.ui.unavailable_description') : t('chat.errors.generic'),
    icon: 'i-lucide-message-circle-off',
    color: 'warning',
  })
}

function onOpenAutoFocus(event: Event) {
  // Reka would focus the first button (close); the message field focuses itself once mounted
  event.preventDefault()
  const panel = event.target as HTMLElement
  panel.focus()
}
</script>

<template>
  <ClientOnly>
    <!-- In <body>, after the app: above the page content without a z-index, below what opens later
         (menus, modals) and the toasts -->
    <Teleport to="body">
      <!-- Non-modal dialog: the page stays usable; Escape, the close button or a click outside close it.
           Full screen on phones, ~400×620 anchored at the bottom right from `sm` up -->
      <UModal
        v-model:open="open"
        :modal="false"
        :overlay="false"
        :transition="false"
        fullscreen
        :content="{ onOpenAutoFocus }"
        :ui="{
          content:
            'origin-bottom-right overflow-hidden motion-safe:data-[state=open]:animate-[scale-in_200ms_ease-out] motion-safe:data-[state=closed]:animate-[scale-out_150ms_ease-in] sm:inset-auto sm:right-4 sm:bottom-4 sm:h-[min(620px,calc(100dvh-2rem))] sm:w-[400px] sm:rounded-2xl sm:shadow-2xl sm:ring sm:ring-default',
          header: 'min-h-14 py-0 pr-14 pl-4 sm:pr-14 sm:pl-4',
          title: 'flex items-center gap-2 text-base',
          body: 'flex min-h-0 flex-col overflow-hidden p-0 sm:p-0',
        }"
      >
        <!-- Trigger: aria-haspopup, aria-expanded and aria-controls come from the dialog -->
        <button
          type="button"
          :aria-label="t('chat.ui.open_chat')"
          class="fixed right-4 bottom-4 grid size-14 cursor-pointer place-items-center rounded-full bg-(--brand-7) text-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-7) motion-safe:transition-transform motion-safe:hover:scale-105 motion-safe:active:scale-95 sm:right-6 sm:bottom-6 dark:focus-visible:outline-white"
          :class="{ invisible: open }"
        >
          <UIcon name="i-lucide-bot-message-square" class="size-7" />
        </button>

        <template #title>
          <UIcon name="i-lucide-bot-message-square" class="size-5 text-(--brand-7)" />
          Serejo Chat
        </template>

        <!-- Rendered inside DialogClose; the default button is labelled by the Nuxt UI locale, not the site's -->
        <template #close="{ ui }">
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            :aria-label="t('chat.ui.close_chat')"
            :class="ui.close({ class: 'top-2.5 end-2' })"
          />
        </template>

        <template #body>
          <ChatPopupInbox
            v-if="currentChatId"
            :id="currentChatId"
            :key="currentChatId"
            @back="currentChatId = null"
            @deleted="currentChatId = null"
            @unavailable="onUnavailable"
          />
          <ChatPopupIndex v-else @open-chat="currentChatId = $event" />
        </template>
      </UModal>
    </Teleport>
  </ClientOnly>
</template>

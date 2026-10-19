<script setup lang="ts">
const input = ref('')
const loading = ref(false)

const greeting = useGreeting()
const localePath = useLocalePath()
const { t } = useI18n()

async function createChat(prompt: string) {
  input.value = prompt
  loading.value = true

  const parts: Array<{ type: string, text?: string, mediaType?: string, url?: string }> = [{ type: 'text', text: prompt }]

  const chat = await $fetch<{ id: string }>('/api/chats', {
    method: 'POST',
    body: {
      message: {
        role: 'user',
        parts
      }
    }
  })

  refreshNuxtData('chats')
  navigateTo(localePath({ name: 'chat-id', params: { id: chat.id } }))
}

async function onSubmit() {
  await createChat(input.value)
}

const quickChats = QUICK_CHATS
</script>

<template>
  <UDashboardPanel
    id="home"
    class="min-h-0 flex-1"
    :ui="{ body: 'p-0 sm:p-0' }"
  >
    <template #header>
      <Navbar />
    </template>

    <template #body>
      <div ref="dropzoneRef" class="flex flex-1">
        <UContainer class="flex flex-1 flex-col justify-center gap-4 py-8 sm:gap-6">
          <h1 class="text-highlighted text-3xl font-bold sm:text-4xl">
            {{ greeting }}
          </h1>

          <UChatPrompt
            v-model="input"
            :status="loading ? 'streaming' : 'ready'"
            class="[view-transition-name:chat-prompt]"
            variant="subtle"
            :ui="{ base: 'px-1.5' }"
            @submit="onSubmit"
          >
            <template #footer>
              <div class="flex items-center gap-1" />

              <UChatPromptSubmit color="neutral" size="sm" />
            </template>
          </UChatPrompt>

          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="quickChat in quickChats"
              :key="quickChat.key"
              :icon="quickChat.icon"
              :label="t(quickChat.key)"
              size="sm"
              color="neutral"
              variant="outline"
              class="hover:bg-accented/50 cursor-pointer rounded-full"
              @click="createChat(t(quickChat.key))"
            />
          </div>
        </UContainer>
      </div>
    </template>
  </UDashboardPanel>
</template>

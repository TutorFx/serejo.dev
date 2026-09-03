<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const props = defineProps<{
  chatId: string
  visibility: 'public' | 'private'
}>()

const emit = defineEmits<{
  'update:visibility': [visibility: 'public' | 'private']
}>()

const toast = useToast()
const clipboard = useClipboard()

const loading = ref(false)

const isShared = computed(() => props.visibility === 'public')
const shareUrl = computed(() => `${window.location.origin}/chat/${props.chatId}`)

const options = [
  {
    value: 'private' as const,
    label: 'Keep private',
    description: 'Only you have access',
    icon: 'i-lucide-lock'
  },
  {
    value: 'public' as const,
    label: 'Shared',
    description: 'Anyone with the link can view',
    icon: 'i-lucide-globe'
  }
]

async function updateVisibility(value: 'public' | 'private') {
  if (value === props.visibility) return

  loading.value = true
  const previous = props.visibility
  emit('update:visibility', value)

  try {
    await $fetch(`/api/chats/${props.chatId}/visibility`, {
      method: 'PATCH' as never,
      body: { visibility: value }
    })
  } catch {
    emit('update:visibility', previous)
    toast.add({
      description: 'Failed to update visibility',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

const copied = ref(false)

function copyLink() {
  clipboard.copy(shareUrl.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <UModal
    :title="isShared ? 'Chat shared' : 'Share chat'"
    :description="isShared ? 'Anyone with the link can view this chat.' : 'Only you can view this chat.'"
    close
  >
    <UTooltip text="Share chat">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-share"
        aria-label="Share chat"
      />
    </UTooltip>

    <template #body>
      <div class="ring-default flex flex-col gap-0.5 rounded-lg p-1 ring">
        <button
          v-for="option in options"
          :key="option.value"
          :disabled="loading"
          :data-selected="option.value === visibility"
          class="hover:bg-elevated/50 data-[selected=true]:bg-elevated/50 flex items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors disabled:opacity-50"
          @click="updateVisibility(option.value)"
        >
          <UIcon :name="option.icon" class="text-muted size-5 shrink-0" />

          <div class="min-w-0 flex-1">
            <p class="text-highlighted text-sm font-medium">
              {{ option.label }}
            </p>
            <p class="text-muted text-sm">
              {{ option.description }}
            </p>
          </div>

          <UIcon
            v-if="visibility === option.value"
            name="i-lucide-circle-check"
            class="text-primary size-5 shrink-0"
          />
        </button>
      </div>

      <div v-if="isShared" class="ring-default mt-4 flex items-center gap-2 rounded-lg px-2 py-1.5 ring">
        <a :href="shareUrl" target="_blank" class="text-muted flex-1 truncate pl-1 text-sm">
          {{ shareUrl }}
        </a>

        <UButton
          :label="copied ? 'Copied!' : 'Copy link'"
          size="sm"
          color="neutral"
          :variant="copied ? 'soft' : 'solid'"
          class="min-w-[72px] justify-center"
          @click="copyLink"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { getChatShareUrl } from '~/utils/ai/share'

const props = defineProps<{
  chatId: string
  visibility: 'public' | 'private'
}>()

const emit = defineEmits<{
  'update:visibility': [visibility: 'public' | 'private']
}>()

const toast = useToast()
const clipboard = useClipboard()
const { t } = useI18n()
const { $csrfFetch } = useNuxtApp()
const localePath = useLocalePath()
const { origin } = useRequestURL()

const loading = ref(false)

const isShared = computed(() => props.visibility === 'public')
// The home in the sharer's language, with `?chat=<id>` opening the popup on this chat
const shareUrl = computed(() => getChatShareUrl(origin, localePath('index'), props.chatId))

const options = computed(() => [
  {
    value: 'private' as const,
    label: t('chat.ui.keep_private'),
    description: t('chat.ui.keep_private_description'),
    icon: 'i-lucide-lock'
  },
  {
    value: 'public' as const,
    label: t('chat.ui.shared_option'),
    description: t('chat.ui.shared_option_description'),
    icon: 'i-lucide-globe'
  }
])

async function updateVisibility(value: 'public' | 'private') {
  if (value === props.visibility) return

  loading.value = true
  const previous = props.visibility
  emit('update:visibility', value)

  try {
    await $csrfFetch(`/api/chats/${props.chatId}/visibility`, {
      method: 'PATCH' as never,
      body: { visibility: value }
    })
  } catch {
    emit('update:visibility', previous)
    toast.add({
      description: t('chat.ui.visibility_failed'),
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
    :title="isShared ? t('chat.ui.shared') : t('chat.ui.share')"
    :description="isShared ? t('chat.ui.share_description_public') : t('chat.ui.share_description_private')"
    close
  >
    <UTooltip :text="t('chat.ui.share')">
      <UButton
        color="neutral"
        variant="ghost"
        size="sm"
        icon="i-lucide-share"
        :aria-label="t('chat.ui.share')"
      />
    </UTooltip>

    <template #body>
      <div class="flex flex-col gap-0.5 rounded-lg p-1 ring ring-default">
        <button
          v-for="option in options"
          :key="option.value"
          :disabled="loading"
          :data-selected="option.value === visibility"
          class="flex items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-elevated/50 disabled:opacity-50 data-[selected=true]:bg-elevated/50"
          @click="updateVisibility(option.value)"
        >
          <UIcon :name="option.icon" class="size-5 shrink-0 text-muted" />

          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-highlighted">
              {{ option.label }}
            </p>
            <p class="text-sm text-muted">
              {{ option.description }}
            </p>
          </div>

          <UIcon
            v-if="visibility === option.value"
            name="i-lucide-circle-check"
            class="size-5 shrink-0 text-primary"
          />
        </button>
      </div>

      <div
        v-if="isShared"
        class="mt-4 flex items-center gap-2 rounded-lg px-2 py-1.5 ring ring-default"
      >
        <a :href="shareUrl" target="_blank" class="flex-1 truncate pl-1 text-sm text-muted">
          {{ shareUrl }}
        </a>

        <UButton
          :label="copied ? t('chat.ui.copied') : t('chat.ui.copy_link')"
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

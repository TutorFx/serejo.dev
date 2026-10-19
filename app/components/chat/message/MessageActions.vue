<script setup lang="ts">
import type { UIMessage } from 'ai'
import { useClipboard } from '@vueuse/core'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'

const props = defineProps<{
  message: UIMessage & { createdAt?: string | Date }
  streaming: boolean
  vote?: boolean | null
}>()

const emit = defineEmits<{
  vote: [message: UIMessage, isUpvoted: boolean]
}>()

const { t, locale } = useI18n()

// Tooltip content only renders on the client, so the runtime time zone is safe here
const fullDate = computed(() => {
  if (!props.message.createdAt) return undefined

  return new Date(props.message.createdAt).toLocaleString(locale.value, { dateStyle: 'medium', timeStyle: 'short' })
})

const clipboard = useClipboard()

const copied = ref(false)

function copy() {
  clipboard.copy(getTextFromMessage(props.message))

  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <template v-if="message.role === 'assistant' && !streaming">
    <UTooltip :text="t('chat.ui.copy_response')">
      <UButton
        size="sm"
        :color="copied ? 'primary' : 'neutral'"
        variant="ghost"
        :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
        :aria-label="t('chat.ui.copy_response')"
        @click="copy"
      />
    </UTooltip>

    <UTooltip :text="t('chat.ui.good_response')">
      <UButton
        size="sm"
        :color="vote === true ? 'success' : 'neutral'"
        variant="ghost"
        icon="i-lucide-thumbs-up"
        :aria-label="t('chat.ui.good_response')"
        @click="emit('vote', message, true)"
      />
    </UTooltip>

    <UTooltip :text="t('chat.ui.bad_response')">
      <UButton
        size="sm"
        :color="vote === false ? 'error' : 'neutral'"
        variant="ghost"
        icon="i-lucide-thumbs-down"
        :aria-label="t('chat.ui.bad_response')"
        @click="emit('vote', message, false)"
      />
    </UTooltip>
  </template>

  <template v-if="message.role === 'user' && !streaming">
    <UTooltip v-if="message.createdAt" :text="fullDate">
      <NuxtTime
        :datetime="message.createdAt"
        :locale="locale"
        hour="numeric"
        minute="2-digit"
        class="text-muted mr-1.5 text-xs"
      />
    </UTooltip>
  </template>
</template>

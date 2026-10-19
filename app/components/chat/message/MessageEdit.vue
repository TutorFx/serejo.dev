<script setup lang="ts">
import type { UIMessage } from 'ai'

const props = defineProps<{
  message: UIMessage
  text: string
}>()

const emit = defineEmits<{
  save: [message: UIMessage, text: string]
  cancel: []
}>()

const editingText = ref(props.text)
const { t } = useI18n()
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <UTextarea
      v-model="editingText"
      autofocus
      autoresize
      :rows="1"
      size="xl"
      variant="none"
      :ui="{ base: 'p-0' }"
    />

    <div class="flex justify-end gap-1.5">
      <UButton
        size="sm"
        variant="soft"
        color="neutral"
        :label="t('chat.ui.cancel')"
        @click="emit('cancel')"
      />
      <UButton
        size="sm"
        :label="t('chat.ui.save')"
        :disabled="!editingText.trim() || editingText === text"
        @click="emit('save', message, editingText)"
      />
    </div>
  </div>
</template>

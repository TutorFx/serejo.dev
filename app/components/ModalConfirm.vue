<script setup lang="ts">
defineProps<{
  title: string
  description: string
  color?: 'error' | 'warning' | 'info' | 'success'
}>()

const emit = defineEmits<{ close: [boolean] }>()
const { t } = useI18n()
</script>

<template>
  <UModal
    :title="title"
    :description="description"
    :ui="{
      footer: 'flex-row-reverse justify-start'
    }"
    :close="false"
    :dismissible="false"
  >
    <template #footer>
      <UButton :color="color" :label="t('chat.ui.delete')" @click="emit('close', true)" />
      <UButton
        color="neutral"
        variant="ghost"
        :label="t('chat.ui.cancel')"
        @click="emit('close', false)"
      />
    </template>
  </UModal>
</template>

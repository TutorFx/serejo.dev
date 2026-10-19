<script setup lang="ts">
const props = defineProps<{
  title?: string
}>()

const emit = defineEmits<{ close: [string | false] }>()

const value = ref(props.title ?? '')
const { t } = useI18n()

const trimmed = computed(() => value.value.trim())

function submit() {
  if (!trimmed.value) return
  emit('close', trimmed.value)
}
</script>

<template>
  <UModal
    :title="t('chat.ui.rename_title')"
    :description="t('chat.ui.rename_description')"
    :ui="{
      footer: 'flex-row-reverse justify-start'
    }"
    :close="false"
  >
    <template #body>
      <UInput
        v-model="value"
        autofocus
        size="lg"
        :placeholder="t('chat.ui.rename_placeholder')"
        class="w-full"
        :ui="{ root: 'w-full' }"
        @keydown.enter.prevent="submit"
      />
    </template>

    <template #footer>
      <UButton :label="t('chat.ui.save')" :disabled="!trimmed" @click="submit" />
      <UButton
        color="neutral"
        variant="ghost"
        :label="t('chat.ui.cancel')"
        @click="emit('close', false)"
      />
    </template>
  </UModal>
</template>

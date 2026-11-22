<script setup lang="ts">
import { pascalCase } from 'scule'
import { useClipboard } from '@vueuse/core'

const props = withDefaults(defineProps<{
  code?: string
  language?: string | null
  filename?: string | null
  highlights?: number[]
  meta?: string | null
  class?: string | null
}>(), {
  code: '',
  language: null,
  filename: null,
  highlights: () => [],
  meta: null,
  class: null,
})

function getLanguageIcon(path: string | null): string | null {
  if (typeof path !== 'string')
    return null

  const [_filePath, fileExtension] = path.split('.')

  if (!fileExtension)
    return null

  switch (fileExtension.toLowerCase()) {
    case 'vue':
      return 'logos:vue'

    case 'ts':
      return 'logos:typescript-icon'

    default:
      return null
  }
}

const icon = computed(() => getLanguageIcon(props.filename))

const { copy, copied } = useClipboard({ source: props.code })
</script>

<template>
  <div class="relative grid rounded-xl bg-base-200">
    <pre
      class="relative grid overflow-x-scroll rounded-t-xl bg-base-300 px-4 pt-6 [&::-webkit-scrollbar]:size-6 [&::-webkit-scrollbar]:border-b-10 [&::-webkit-scrollbar]:border-base-300 [&::-webkit-scrollbar]:bg-base-300 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-thumb]:border-6 [&::-webkit-scrollbar-thumb]:border-base-300 [&::-webkit-scrollbar-thumb]:bg-base-100 [&::-webkit-scrollbar-track]:rounded-xl [&::-webkit-scrollbar-track]:bg-base-300"
      :class="$props.class"
    >
      <slot />
    </pre>
    <div
      class="grid grid-flow-col items-center justify-between rounded-b-xl border-t-2 border-base-100 px-3 py-1"
    >
      <div class="grid grid-flow-col items-center gap-3">
        <div v-if="icon" class="grid items-center">
          <Icon :name="icon" />
        </div>
        <div>
          {{ props.filename ?? pascalCase(props.language || 'plaintext') }}
        </div>
      </div>
      <div
        class="grid size-11 cursor-pointer items-center justify-center rounded-lg border-2 border-base-100 bg-base-300 p-3"
        @click="() => copy()"
      >
        <Icon v-if="!copied" name="line-md:clipboard" />
        <Icon v-else name="line-md:clipboard-check" />
      </div>
    </div>
  </div>
</template>

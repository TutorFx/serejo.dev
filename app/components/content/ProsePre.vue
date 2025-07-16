<template>
  <div class="grid relative bg-base-200 rounded-xl">
    <pre
      class="
      pt-6
      px-4
      bg-base-300 
      rounded-t-xl 
      grid 
      overflow-x-scroll
      relative

      [&::-webkit-scrollbar]:size-6
      [&::-webkit-scrollbar]:bg-base-300
      [&::-webkit-scrollbar]:border-b-10
      [&::-webkit-scrollbar]:border-base-300

      [&::-webkit-scrollbar-track]:bg-base-300
      [&::-webkit-scrollbar-track]:rounded-xl
      
      [&::-webkit-scrollbar-thumb]:border-6
      [&::-webkit-scrollbar-thumb]:border-base-300
      [&::-webkit-scrollbar-thumb]:bg-base-100
      [&::-webkit-scrollbar-thumb]:rounded-xl
      " 
      :class="$props.class"
    >
      <slot />
    </pre>
    <div class="rounded-b-xl px-3 py-1 grid grid-flow-col items-center justify-between border-t-2 border-base-100">
      <div class="grid grid-flow-col items-center gap-3">
        <div v-if="icon" class="grid items-center">
          <Icon :name="icon" />
        </div>
        <div>
          {{ props.filename ?? pascalCase(props.language || 'plaintext') }}
        </div>
      </div>
      <div class="h-11 w-11 grid justify-center items-center p-3 bg-base-300 rounded-lg border-2 border-base-100 cursor-pointer" @click="() => copy()">
        <Icon v-if="!copied" name="line-md:clipboard" />
        <Icon v-else name="line-md:clipboard-check" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { pascalCase } from "scule";
import { useClipboard } from '@vueuse/core'

function getLanguageIcon(path: string | null) : string | null {
  if (typeof path !== 'string') return null

  const [filePath, fileExtension] = path.split('.')

  if (!fileExtension) return null

  switch (fileExtension.toLowerCase()) {
    case 'vue':
      return 'logos:vue'
    
    case 'ts':
      return 'logos:typescript-icon'
  
    default:
      return null
  }
}

const props = defineProps({
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: null
  },
  filename: {
    type: String,
    default: null
  },
  highlights: {
    type: Array as () => number[],
    default: () => []
  },
  meta: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: null
  }
})

const icon = computed(() => getLanguageIcon(props.filename))

const { text, copy, copied, isSupported } = useClipboard({ source: props.code })
</script>
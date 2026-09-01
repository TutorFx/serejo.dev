<script setup lang="ts">
import { getFaviconUrl, getDomain } from '~/utils/ai/url'
import type { Source } from '~/utils/ai/tool'

defineProps<{
  sources: Source[]
}>()
</script>

<template>
  <div v-if="sources.length" class="border-default @container max-h-40 overflow-y-auto rounded-md border p-1">
    <div class="grid grid-cols-1 gap-1 @md:grid-cols-2">
      <a
        v-for="source in sources"
        :key="source.url"
        :href="source.url"
        target="_blank"
        rel="noopener noreferrer"
        class="text-muted hover:text-default hover:bg-elevated/50 flex min-w-0 items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors @sm:text-sm"
      >
        <img
          :src="getFaviconUrl(source.url)"
          :alt="getDomain(source.url)"
          class="size-4 shrink-0 rounded-sm"
          loading="lazy"
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        >
        <span class="truncate">{{ source.title || getDomain(source.url) }}</span>
        <span v-if="source.title" class="text-dimmed ms-auto hidden shrink-0 text-xs @xs:inline">{{ getDomain(source.url) }}</span>
      </a>
    </div>
  </div>
</template>

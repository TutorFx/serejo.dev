<script setup lang="ts">
import { getFaviconUrl, getDomain } from '~/utils/ai/url'
import type { Source } from '~/utils/ai/tool'

defineProps<{
  sources: Source[]
}>()
</script>

<template>
  <div
    v-if="sources.length"
    class="@container max-h-40 overflow-y-auto rounded-md border border-default p-1"
  >
    <div class="grid grid-cols-1 gap-1 @md:grid-cols-2">
      <a
        v-for="source in sources"
        :key="source.url"
        :href="source.url"
        target="_blank"
        rel="noopener noreferrer"
        class="flex min-w-0 items-center gap-2 rounded-md px-2 py-1 text-xs text-muted transition-colors hover:bg-elevated/50 hover:text-default @sm:text-sm"
      >
        <img
          :src="getFaviconUrl(source.url)"
          :alt="getDomain(source.url)"
          class="size-4 shrink-0 rounded-sm"
          loading="lazy"
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        />
        <span class="truncate">{{ source.title || getDomain(source.url) }}</span>
        <span
          v-if="source.title"
          class="ms-auto hidden shrink-0 text-xs text-dimmed @xs:inline"
          >{{ getDomain(source.url) }}</span
        >
      </a>
    </div>
  </div>
</template>

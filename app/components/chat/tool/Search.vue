<script setup lang="ts">
import type { HybridSearchUIToolInvocation } from '../../../../shared/utils/tools/search'

const props = defineProps<{
  invocation: HybridSearchUIToolInvocation
  streaming?: boolean
}>()

const { t } = useI18n()

const query = computed(() => props.invocation.input?.query ?? '')
const results = computed(() => props.invocation.output?.results ?? [])

function formatDocumentTitle(docId: string): string {
  const fileName = docId.split('/').pop() || docId
  return fileName.replace(/\.md$/, '')
}

function getCollectionIcon(col?: string): string {
  switch (col) {
    case 'blog':
      return 'i-lucide-newspaper'
    case 'projects':
      return 'i-lucide-folder-git-2'
    case 'history':
      return 'i-lucide-briefcase'
    case 'education':
      return 'i-lucide-graduation-cap'
    case 'pages':
      return 'i-lucide-file-text'
    case 'routes':
      return 'i-lucide-compass'
    default:
      return 'i-lucide-file'
  }
}

function getCollectionColor(col?: string): 'primary' | 'neutral' | 'success' | 'warning' | 'info' {
  switch (col) {
    case 'blog':
      return 'primary'
    case 'projects':
      return 'info'
    case 'education':
      return 'warning'
    case 'history':
      return 'success'
    case 'routes':
      return 'primary'
    default:
      return 'neutral'
  }
}
</script>

<template>
  <div class="@container w-full">
    <UChatTool
      v-if="invocation.state === 'output-available'"
      icon="i-lucide-library"
      :text="t('chat.tool_search.completed')"
      :suffix="query ? `“${query}”` : undefined"
      chevron="leading"
      class="my-2"
    >
      <div
        class="@container max-h-64 overflow-y-auto rounded-md border border-default bg-elevated/30 p-1.5 text-xs"
      >
        <div v-if="results.length" class="grid grid-cols-1 gap-1.5 @lg:grid-cols-2">
          <div
            v-for="(item, idx) in results"
            :key="`${item.documentId}-${item.index}-${idx}`"
            class="flex flex-col justify-between gap-1.5 rounded-md p-2 transition-colors hover:bg-elevated/60 @xs:p-2.5"
          >
            <div class="flex items-center justify-between gap-2">
              <div class="flex min-w-0 items-center gap-1.5 @xs:gap-2">
                <UBadge
                  v-if="item.collection"
                  size="xs"
                  variant="subtle"
                  :color="getCollectionColor(item.collection)"
                  class="shrink-0"
                >
                  <UIcon :name="getCollectionIcon(item.collection)" class="size-3 @xs:mr-1" />
                  <span class="hidden @2xs:inline">
                    {{ t(`chat.tool_search.collections.${item.collection}`) || item.collection }}
                  </span>
                </UBadge>
                <span class="truncate font-mono text-[11px] text-muted @xs:text-xs">
                  {{ formatDocumentTitle(item.documentId) }}
                </span>
              </div>

              <UButton
                v-if="item.route"
                :to="item.route"
                size="xs"
                color="neutral"
                variant="ghost"
                trailing-icon="i-lucide-arrow-up-right"
                class="h-5 shrink-0 px-1.5 text-[10px]"
                :aria-label="t('chat.tool_search.view_page')"
              >
                <span class="hidden @xs:inline">{{ t('chat.tool_search.view_page') }}</span>
              </UButton>
            </div>

            <p
              class="line-clamp-2 text-[11px] leading-relaxed text-dimmed @xs:text-xs @sm:line-clamp-3"
            >
              {{ item.content }}
            </p>
          </div>
        </div>

        <div v-else class="p-2 text-center text-xs text-muted">
          {{ t('chat.tool_search.no_results') }}
        </div>
      </div>
    </UChatTool>

    <div
      v-else-if="invocation.state === 'output-error'"
      class="my-2 flex items-center gap-2 text-xs text-error"
    >
      <UIcon name="i-lucide-alert-circle" class="size-4 shrink-0" />
      <span>{{ t('chat.tool_search.error') }}</span>
    </div>

    <div v-else class="my-2 flex min-w-0 items-center gap-2 text-xs text-muted">
      <ChatIndicator class="shrink-0 text-primary" />
      <UChatShimmer :text="t('chat.tool_search.loading')" class="shrink-0 text-xs font-medium" />
      <span v-if="query" class="min-w-0 truncate font-mono opacity-70"> “{{ query }}” </span>
    </div>
  </div>
</template>

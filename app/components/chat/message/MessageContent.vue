<script setup lang="ts">
import { isReasoningUIPart, isTextUIPart, isToolUIPart, getToolName } from 'ai'
import type { UIMessage } from 'ai'
import { isPartStreaming, isToolStreaming } from '@nuxt/ui/utils/ai'
import { getMergedParts } from '~/utils/ai'
import { getSearchQuery, getSources } from '~/utils/ai/tool'
import type { CalendarUIToolInvocation, CreateMeetingUIToolInvocation } from '#shared/utils/tools/calendar'
import type { HybridSearchUIToolInvocation } from '#shared/utils/tools/search'
import { CHAT_TOOL } from '#shared/utils/constants'

defineProps<{
  message: UIMessage
}>()

const emit = defineEmits<{
  approve: [id: string]
  deny: [id: string]
}>()
</script>

<template>
  <template v-for="(part, index) in getMergedParts(message.parts)" :key="`${message.id}-${part.type}-${index}`">
    <UChatReasoning
      v-if="isReasoningUIPart(part)"
      :text="part.text"
      :streaming="isPartStreaming(part)"
      chevron="leading"
    >
      <ChatComark
        :markdown="part.text"
        :streaming="isPartStreaming(part)"
      />
    </UChatReasoning>

    <template v-else-if="isToolUIPart(part)">
      <UChatTool
        v-if="getToolName(part) === 'web_search' || getToolName(part) === 'google_search'"
        :text="isToolStreaming(part) ? 'Searching the web...' : 'Searched the web'"
        :suffix="getSearchQuery(part)"
        :streaming="isToolStreaming(part)"
        chevron="leading"
      >
        <ChatToolSources :sources="getSources(part)" />
      </UChatTool>

      <ChatToolSearch
        v-else-if="getToolName(part) === CHAT_TOOL.searchContent"
        :invocation="{ ...(part as HybridSearchUIToolInvocation) }"
        :streaming="isToolStreaming(part)"
      />

      <ChatToolCalendar
        v-else-if="getToolName(part) === CHAT_TOOL.calendar"
        :invocation="{ ...(part as CalendarUIToolInvocation) }"
      />

      <ChatToolMeet
        v-else-if="getToolName(part) === CHAT_TOOL.createMeeting"
        :invocation="{ ...(part as CreateMeetingUIToolInvocation) }"
        @approve="emit('approve', (part as CreateMeetingUIToolInvocation).approval?.id ?? part.toolCallId)"
        @deny="emit('deny', (part as CreateMeetingUIToolInvocation).approval?.id ?? part.toolCallId)"
      />
    </template>

    <template v-else-if="isTextUIPart(part)">
      <ChatComark
        v-if="message.role === 'assistant'"
        :markdown="part.text"
        :streaming="isPartStreaming(part)"
      />
      <template v-else-if="message.role === 'user'">
        <p class="whitespace-pre-wrap">
          {{ part.text }}
        </p>
      </template>
    </template>
  </template>
</template>

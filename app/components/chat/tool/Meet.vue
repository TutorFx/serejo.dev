<script setup lang="ts">
import { format, parseISO } from 'date-fns'

defineProps<{
  invocation: CreateMeetingUIToolInvocation
}>()

const emit = defineEmits<{
  approve: []
  deny: []
}>()

const formatDateTime = (isoString?: string) => {
  if (!isoString) return ''
  try {
    return format(parseISO(isoString), 'dd/MM/yyyy \'às\' HH:mm')
  } catch (e: unknown) {
    if (e instanceof Error) {
      return isoString
    }

    return isoString
  }
}
</script>

<template>
  <UCard v-if="invocation.state === 'approval-requested'" class="my-5">
    <template #header>
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-calendar-plus" class="text-primary size-6" />
        <div>
          <h3 class="text-primary text-base leading-tight font-semibold">
            {{ $t('chat.tool_meet.confirm') }}
          </h3>
          <p class="text-muted text-sm">
            {{ $t('chat.tool_meet.description') }}
          </p>
        </div>
      </div>
    </template>

    <div class="flex flex-col gap-4 text-sm">
      <div v-if="invocation.input.summary" class="flex gap-2">
        <span class="text-foreground w-20 shrink-0 font-medium">{{ $t('chat.tool_meet.summary') }}</span>
        <span class="text-muted">{{ invocation.input.summary }}</span>
      </div>
      <div v-if="invocation.input.startTime" class="flex gap-2">
        <span class="text-foreground w-20 shrink-0 font-medium">{{ $t('chat.tool_meet.start') }}</span>
        <span class="text-muted">{{ formatDateTime(invocation.input.startTime) }}</span>
      </div>
      <div v-if="invocation.input.endTime" class="flex gap-2">
        <span class="text-foreground w-20 shrink-0 font-medium">{{ $t('chat.tool_meet.end') }}</span>
        <span class="text-muted">{{ formatDateTime(invocation.input.endTime) }}</span>
      </div>
      <div v-if="invocation.input.attendees && invocation.input.attendees.length > 0" class="flex flex-col gap-2">
        <span class="text-foreground font-medium">{{ $t('chat.tool_meet.attendees') }}</span>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="email in invocation.input.attendees"
            :key="email"
            color="neutral"
            variant="soft"
            size="md"
          >
            {{ email }}
          </UBadge>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3">
        <UButton color="primary" @click="emit('approve')">
          {{ $t('chat.tool_meet.approve') }}
        </UButton>
        <UButton color="neutral" variant="ghost" @click="emit('deny')">
          {{ $t('chat.tool_meet.deny') }}
        </UButton>
      </div>
    </template>
  </UCard>

  <UCard v-else-if="invocation.state === 'output-available'" class="my-5">
    <template #header>
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-check-circle-2" class="text-success size-6" />
        <div>
          <h3 class="text-foreground text-base leading-tight font-semibold">
            {{ $t('chat.tool_meet.scheduled') }}
          </h3>
          <p class="text-muted text-sm">
            {{ invocation.output?.summary }}
          </p>
        </div>
      </div>
    </template>

    <UAlert
      class="mt-2"
      icon="i-lucide-mail-check"
      color="primary"
      variant="soft"
      :title="$t('chat.tool_meet.next_step')"
      :description="$t('chat.tool_meet.next_step_desc')"
    />
  </UCard>

  <UAlert
    v-else-if="invocation.state === 'output-error'"
    class="my-5"
    icon="i-lucide-triangle-alert"
    color="error"
    variant="subtle"
    :title="$t('chat.tool_meet.error')"
  />

  <UAlert
    v-else-if="invocation.state === 'output-denied'"
    class="my-5"
    icon="i-lucide-x-circle"
    color="neutral"
    variant="subtle"
    :title="$t('chat.tool_meet.denied_alert')"
  />

  <UCard v-else class="my-5">
    <div class="flex flex-col items-center justify-center py-6">
      <UIcon
        name="i-lucide-loader-circle"
        class="text-primary mb-3 size-8 animate-spin"
      />
      <div class="text-muted text-sm font-medium">
        {{ $t('chat.tool_meet.loading') }}
      </div>
    </div>
  </UCard>
</template>

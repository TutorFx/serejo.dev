<script setup lang="ts">
import { format, parseISO } from 'date-fns'
import type { CalendarUIToolInvocation } from '../../../../shared/utils/tools/calendar'

const { t } = useI18n()

defineProps<{
  invocation: CalendarUIToolInvocation
}>()

const formatTime = (isoString: string) => {
  if (!isoString) return ''
  return format(parseISO(isoString), 'HH:mm')
}

const formatDate = (isoString: string) => {
  if (!isoString) return ''
  return format(parseISO(isoString), 'dd/MM/yyyy')
}
</script>

<template>
  <div class="@container w-full">
    <UCard v-if="invocation.state === 'output-available'" class="my-5">
      <template #header>
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-calendar-days" class="text-primary size-6 shrink-0" />
          <div>
            <h3 class="text-foreground text-base leading-tight font-semibold">
              {{ t('chat.tool_calendar.availability') }}
            </h3>
            <p class="text-muted text-sm">
              {{ formatDate(invocation.input.date) }}
            </p>
          </div>
        </div>
      </template>

      <div class="flex flex-col gap-6 @md:grid @md:grid-cols-2">
        <!-- Horários Livres -->
        <div v-if="invocation.output?.free?.length" class="flex flex-col gap-3">
          <div class="text-foreground flex items-center gap-2 text-sm font-medium">
            <UIcon name="i-lucide-check-circle-2" class="text-success size-5 shrink-0" />
            {{ t('chat.tool_calendar.free_slots') }}
          </div>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="(slot, index) in invocation.output.free"
              :key="'free-'+index"
              color="success"
              variant="subtle"
              size="md"
              class="w-full justify-center @2xs:w-auto"
            >
              <UIcon name="i-lucide-clock" class="mr-1.5 size-4 opacity-70" />
              {{ formatTime(slot.start) }} - {{ formatTime(slot.end) }}
            </UBadge>
          </div>
        </div>

        <UAlert
          v-else
          icon="i-lucide-calendar-x"
          color="neutral"
          variant="soft"
          :title="t('chat.tool_calendar.no_slots')"
        />

        <!-- Horários Ocupados -->
        <div v-if="invocation.output?.busy?.length" class="flex flex-col gap-3">
          <div class="text-foreground flex items-center gap-2 text-sm font-medium">
            <UIcon name="i-lucide-x-circle" class="text-error size-5 shrink-0" />
            {{ t('chat.tool_calendar.busy_slots') }}
          </div>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="(slot, index) in invocation.output.busy"
              :key="'busy-'+index"
              color="neutral"
              variant="subtle"
              size="md"
              class="w-full justify-center @2xs:w-auto"
            >
              <div class="bg-error mr-2 h-2 w-2 shrink-0 rounded-full" />
              {{ formatTime(slot.start) }} - {{ formatTime(slot.end) }}
            </UBadge>
          </div>
        </div>
      </div>

      <template v-if="invocation.output?.overlap !== undefined && invocation.output?.overlap !== 0" #footer>
        <div class="text-muted flex items-center gap-2 text-xs @sm:text-sm">
          <UIcon name="i-lucide-globe" class="size-5 shrink-0" />
          <div>
            <span class="font-medium">{{ t('chat.tool_calendar.timezone_difference') }}</span>
            {{ Math.abs(invocation.output.overlap) }}h {{ invocation.output.overlap > 0 ? '+' : '-' }}
          </div>
        </div>
      </template>
    </UCard>

    <UAlert
      v-else-if="invocation.state === 'output-error'"
      class="my-5"
      icon="i-lucide-triangle-alert"
      color="error"
      variant="subtle"
      :title="t('chat.tool_calendar.error')"
    />

    <UCard v-else class="my-5">
      <div class="flex flex-col items-center justify-center py-6">
        <UIcon
          name="i-lucide-loader-circle"
          class="text-primary mb-3 size-8 animate-spin"
        />
        <div class="text-muted text-sm font-medium">
          {{ t('chat.tool_calendar.loading') }}
        </div>
      </div>
    </UCard>
  </div>
</template>

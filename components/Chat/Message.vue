<script setup lang="ts" generic="T extends AbstractAgent">
import type Message from '@/utils/chat/entities/Message'
import type AbstractAgent from '@/utils/chat/entities/AbstractAgent'

import Bot from '@/utils/chat/entities/Agent/Bot'
import User from '@/utils/chat/entities/Agent/User'

defineProps<{ value: Message<T> }>()
</script>

<template>
  <div v-if="(value.agent instanceof Bot)">
    <div class="grid grid-cols-[minmax(0,_max-content)] justify-start gap-3">
      <div class="gap-2 overflow-hidden">
        <MDC :value="value.message" class="bg-base-100 prose-md rounded-r-lg rounded-bl-lg p-3 text-sm prose" />
      </div>
    </div>
  </div>
  <div v-else-if="(value.agent instanceof User)">
    <div class="grid-cols-[minmax(0,_max-content) grid justify-end gap-3">
      <div class="gap-2 overflow-hidden">
        <div class="rounded-l-lg rounded-br-lg bg-blue-600 p-3 text-sm text-white">
          {{ value.message }}
        </div>
      </div>
    </div>
  </div>
</template>

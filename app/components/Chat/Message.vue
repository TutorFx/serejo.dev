<script setup lang="ts" generic="T extends AbstractAgent">
import Bot from '@/utils/chat/entities/Agent/Bot'
import User from '@/utils/chat/entities/Agent/User'

import type AbstractAgent from '~/utils/chat/entities/AbstractAgent'
import type Message from '~/utils/chat/entities/Message'

defineProps<{ value: Message<T> }>()
</script>

<template>
  <div v-if="(value.agent instanceof Bot)">
    <div class="gap-3 grid justify-start grid-cols-[minmax(0,_max-content)]">
      <div class="gap-2 overflow-hidden">
        <MDC :value="value.message" class="bg-base-100 p-3 text-sm prose prose-md rounded-r-lg rounded-bl-lg" />
      </div>
    </div>
  </div>
  <div v-else-if="(value.agent instanceof User)">
    <div class="grid gap-3 justify-end grid-cols-[minmax(0,_max-content)">
      <div class="gap-2 overflow-hidden">
        <div class="p-3 text-sm bg-blue-600 text-white rounded-l-lg rounded-br-lg">
          {{ value.message }}
        </div>
      </div>
    </div>
  </div>
</template>

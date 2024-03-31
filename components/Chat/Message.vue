<script setup lang="ts" generic="T extends AbstractAgent">
import type Message from '@/utils/chat/entities/Message'
import type AbstractAgent from '@/utils/chat/entities/AbstractAgent'

import Bot from '@/utils/chat/entities/Agent/Bot'
import User from '@/utils/chat/entities/Agent/User'

defineProps<{ value: Message<T> }>()
</script>

<template>
  <div v-if="(value.agent instanceof Bot)">
    <div class="grid gap-3 justify-start grid-cols-[max-content_minmax(0,_max-content)]">
      <div class="rounded-full h-10 bg-gray-300 flex-shrink-0 w-10" />
      <div class="gap-2 overflow-hidden">
        <div class="bg-gray-300 p-3 text-sm rounded-r-lg rounded-bl-lg">
          {{ value.message }}
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="(value.agent instanceof User)">
    <div class="grid justify-end gap-3 grid-cols-[minmax(0,_max-content)_max-content]">
      <div class="gap-2 overflow-hidden">
        <div class="p-3 text-sm bg-blue-600 text-white rounded-l-lg rounded-br-lg">
          {{ value.message }}
        </div>
      </div>
      <div>
        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300" />
      </div>
    </div>
  </div>
</template>

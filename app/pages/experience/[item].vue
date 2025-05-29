<script setup lang="ts">
import HistoryItemService from '../../utils/cms/history/HistoryItemService'

const route = useRoute()
const { data } = await getHistoryItem((route.params as { item: string }).item)
const itemService = computed(() => data.value && new HistoryItemService(data.value))

if (itemService.value && itemService.value instanceof HistoryItemService) {
  useHead({
    title: itemService.value.getItem().org,
    meta: [
      { name: 'description', content: itemService.value.getItem().getBodyAsPlain() },
    ],
  })
}
</script>

<template>
  <div v-if="(itemService instanceof HistoryItemService)">
    <HistorySinglePage :value="itemService.getItem()" />
  </div>
</template>

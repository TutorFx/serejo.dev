<template>
    <div v-if="HistoryService">
        {{HistoryService.getRepository()}}
    </div>
</template>

<script lang="ts" setup>
const history = await getHistory()
const HistoryService = computed(() => history.data.value && getHistoryService(history.data.value))
</script>
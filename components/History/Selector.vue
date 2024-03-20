<template>
    <div v-if="service && (service instanceof HistoryService)">
        <div>
            <div v-for="(item, i) in service.getRepository()" :key="i">
                {{  }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import HistoryService from '~/utils/cms/history/HistoryService';

const history = await getHistory()
const service = computed(() => history.data.value && getHistoryService(history.data.value))
</script>
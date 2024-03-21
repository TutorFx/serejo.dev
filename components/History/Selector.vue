<template>
    <div v-if="service && (service instanceof HistoryService)" 
        class="grid gap-12"
    >
        <div class="overflow-hidden">
            <Container>
                <ClientOnly>
                    <HistorySelectorRepositorySlider @change="(e) => current = e" :repository="service.repository" />
        
                    <template #fallback>
                        <div>
                            carregando...
                        </div>
                    </template>
                </ClientOnly>
            </Container>
        </div>
        <Container v-if="current && (current instanceof HistoryController)">
            <div class="p-6 md:p-24 bg-base-300">
                <div>
                    <div>{{  }}</div>
                    <MDC class="text-xl" :value="current" />
                </div>
            </div>
        </Container>
    </div>
</template>

<script lang="ts" setup>
import HistoryService from '~/utils/cms/history/HistoryService';
import HistoryController from '~/utils/cms/history/HistoryController';

const history = getHistory()
const service = computed(() => history.data.value && getHistoryService(history.data.value))

const current = ref()
</script>
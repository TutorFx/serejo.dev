<template>
    <div>
        <Swiper :modules="[Virtual, Controller]" @swiper="swiperEvent" @slideChange="swiperEvent" virtual
            :autoplay="{ delay: 15000 }" space-between="40" :breakpoints="BREAKPOINTS">
            <SwiperSlide v-for="(item, i) in repository.getRepository()" @click="() => currentInstance?.slideTo(i)"
                :class="{ current: currentItem && (currentItem?._id == item._id) }" class="overflow-visible" :key="item._id">
                <HistorySelectorRepositoryItem :item="item" />
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<script setup lang="ts">
import type { Swiper as s } from 'swiper/types';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Virtual, Controller } from 'swiper/modules';
import HistoryRepository from "../../../utils/cms/history/HistoryRepository";
import HistoryController from '~/utils/cms/history/HistoryController';

import 'swiper/css';
import 'swiper/css/pagination';

const props = defineProps<{
    repository: HistoryRepository
}>()
const emit = defineEmits<{
    (e: 'change', id: HistoryController): void
}>()

const BREAKPOINTS = {
    '300': {
        slidesPerView: 1.15,
        spaceBetween: 10,
    },
    '640': {
        slidesPerView: 1.5,
        spaceBetween: 40,
        centeredSlides: true,
    },
    '1024': {
        slidesPerView: 3,
        spaceBetween: 50,
        centeredSlides: true,
    },
    '1920': {
        slidesPerView: 3,
        spaceBetween: 50,
        centeredSlides: true,
    },
}

const getItem = (i: number, repository: HistoryRepository) =>
    (repository.getRepository().length >= i) ? repository.getItemByIndex(i) : null;

const swiperEvent = (event: s) => {
    const item = getItem(event.activeIndex, props.repository);
    if (!item) return;
    
    emit('change', item);
    
    currentIndex.value = event.activeIndex;
    currentInstance.value = event;
}

const currentIndex = ref(0)

const currentItem = computed(() => getItem(currentIndex.value, props.repository));

const currentInstance = shallowRef<s | null>(null)

watch(() => props.repository, (repository) => {
    if (!currentItem.value) return;
    emit('change', currentItem.value);
})

</script>
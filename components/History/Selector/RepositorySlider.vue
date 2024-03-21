<template>
    <div class="relative">
        <div class="absolute inset-y-0 left-full z-10 w-1/3 bg-gradient-to-l from-base-100 from-80% to-transparent" />
        <div class="absolute inset-y-0 right-full z-10 w-1/3 bg-gradient-to-r from-base-100 from-80% to-transparent" />
        <Swiper class="!overflow-visible" :modules="[Virtual, Controller]" @swiper="swiperEvent" @slideChange="swiperEvent"
            virtual :autoplay="{ delay: 15000 }" space-between="40" :breakpoints="BREAKPOINTS">
            <SwiperSlide v-for="(item, i) in repository.getRepository()" :class="{ current: currentItem._id === item._id }" :key="item._id">
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
        slidesPerView: 1.05,
        spaceBetween: 15,
        centeredSlides: false,
    },
    '1024': {
        slidesPerView: 3,
        spaceBetween: 30,
        centeredSlides: true,
    },
    '1600': {
        slidesPerView: 3,
        spaceBetween: 40,
        centeredSlides: true,
    },
};

const getItem = (i: number, repository: HistoryRepository) =>
    repository.getItemByIndex(i);

const swiperEvent = (event: s) => {
    emit('change', getItem(event.activeIndex, props.repository));
    currentItem.value = getItem(event.activeIndex, props.repository);
}

const currentItem = ref(getItem(0, props.repository))

</script>
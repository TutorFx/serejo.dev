<template>
    <div>
        <Swiper :modules="[Virtual, Controller]" @swiper="swiperEvent" @slideChange="swiperEvent" virtual
            :autoplay="{ delay: 15000 }" space-between="40" :breakpoints="BREAKPOINTS">
            <SwiperSlide v-for="(item, i) in repository.getRepository()" @click="() => currentInstance?.slideTo(i)"
                :class="{ current: currentItem._id === item._id }" class="overflow-visible" :key="item._id">
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
    repository.getItemByIndex(i);

const swiperEvent = (event: s) => {
    emit('change', getItem(event.activeIndex, props.repository));
    currentItem.value = getItem(event.activeIndex, props.repository);
    currentInstance.value = event;
}

const currentItem = ref(getItem(0, props.repository));

const currentInstance = ref<s | null>(null)

</script>
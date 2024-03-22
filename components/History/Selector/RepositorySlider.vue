<script setup lang="ts">
import type { Swiper as s } from 'swiper/types'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Controller, Virtual } from 'swiper/modules'
import type HistoryRepository from '../../../utils/cms/history/HistoryRepository'
import type HistoryController from '~/utils/cms/history/HistoryController'

import 'swiper/css'
import 'swiper/css/pagination'

const props = defineProps<{
  repository: HistoryRepository
}>()
const emit = defineEmits<{
  (e: 'change', id: HistoryController): void
}>()

const BREAKPOINTS = {
  300: {
    slidesPerView: 1.15,
    spaceBetween: 10,
  },
  640: {
    slidesPerView: 1.5,
    spaceBetween: 40,
    centeredSlides: true,
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 50,
    centeredSlides: true,
  },
  1920: {
    slidesPerView: 3,
    spaceBetween: 50,
    centeredSlides: true,
  },
}

function getItem(i: number, repository: HistoryRepository) {
  return (repository.getRepository().length >= i) ? repository.getItemByIndex(i) : null
}

function swiperEvent(event: s) {
  const item = getItem(event.activeIndex, props.repository)
  if (!item)
    return

  emit('change', item)

  currentIndex.value = event.activeIndex
  currentInstance.value = event
}

const currentIndex = ref(0)

const currentItem = computed(() => getItem(currentIndex.value, props.repository))

const currentInstance = shallowRef<s | null>(null)

watch(() => props.repository, (repository) => {
  if (!currentItem.value)
    return
  emit('change', currentItem.value)
})
</script>

<template>
  <div>
    <Swiper
      :modules="[Virtual, Controller]" virtual :autoplay="{ delay: 15000 }" space-between="40"
      :breakpoints="BREAKPOINTS" @swiper="swiperEvent" @slide-change="swiperEvent"
    >
      <SwiperSlide
        v-for="(item, i) in repository.getRepository()" :key="item._id"
        :class="{ current: currentItem && (currentItem?._id == item._id) }" class="overflow-visible" @click="() => currentInstance?.slideTo(i)"
      >
        <HistorySelectorRepositoryItem :item="item" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

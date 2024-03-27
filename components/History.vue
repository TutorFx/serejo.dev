<script lang="ts" setup>
import HistoryRepository from '~/utils/cms/history/HistoryRepository';
import HistoryService from '~/utils/cms/history/HistoryService'

const { data } = await getHistory()
const service = computed(() => (data.value instanceof HistoryRepository) && getHistoryService(data.value))

const localePath = useLocalePath()
</script>

<template>
  <div v-if="(service instanceof HistoryService)" class="grid py-12 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
    <NuxtLink v-for="item in service.getRepository()" :key="item._id" :to="localePath({ name: `experience-item`, params: { item: item.org } })" class="grid bg-base-100 aspect-video rounded-md group p-4">
      <div class="grid gap-2 grid-rows-[max-content_1fr_max-content]">
        <div class="grid grid-cols-[1fr_max-content] justify-between">
          <div class="text-xl xl:text-3xl">
            {{ item.org }}
          </div>
          <div>
            <div>
              {{ item.location }}
            </div>
            <div class="grid grid-flow-col justify-start items-center gap-1">
              <Icon name="solar:calendar-bold-duotone" />
              <div class="text-neutral text-xs">
                {{ item.getDateToLocaleString(useLocale()).join(` ● `) }}
              </div>
            </div>
          </div>
        </div>
        <div class="relative">
          <div class="inset-0 overflow-hidden line-clamp-2 text-ellipsis">
            {{ item.getTruncatedDescription(200) }}
          </div>
        </div>
        <div class="flex justify-between items-end">
          <div class="text-xs">
            <Icon name="gg:alarm" /> {{ item.getLocaleReadingTime() }}
          </div>
          <Btn color="light">
            {{ $t('see_more') }}
          </Btn>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

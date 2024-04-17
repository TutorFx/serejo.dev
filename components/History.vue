<script lang="ts" setup>
import HistoryRepository from '~/utils/cms/history/HistoryRepository'
import HistoryService from '~/utils/cms/history/HistoryService'

const { data } = await getHistory()
const service = computed(() => (data.value instanceof HistoryRepository) && getHistoryService(data.value))

const localePath = useLocalePath()
</script>

<template>
  <div v-if="(service instanceof HistoryService)" class="grid py-12 lg:grid-cols-3 sm:grid-cols-2 gap-x-4 gap-y-6">
    <NuxtLink
      v-for="item in service.getRepository()"
      :key="item._id"
      v-hoverable:history
      :to="localePath({ name: `experience-item`, params: { item: item.org } })"
      class="grid aspect-video bg-base-100 rounded-md p-4 group"
    >
      <div class="grid grid-rows-[max-content_1fr_max-content] gap-2">
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
          <div class="overflow-hidden inset-0 line-clamp-2 text-ellipsis">
            {{ item.getTruncatedDescription(200) }}
          </div>
        </div>
        <div class="justify-between items-end flex">
          <div class="text-xs">
            <Icon name="gg:alarm" /> {{ $t('time.reading_time', { time: item.getLocaleReadingTime() }) }}
          </div>
          <Btn color="light">
            {{ $t('see_more') }}
          </Btn>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

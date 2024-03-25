<script lang="ts" setup>
import HistoryService from '~/utils/cms/history/HistoryService'

const history = await getHistory()
const service = computed(() => history.data.value && getHistoryService(history.data.value))

const localePath = useLocalePath()
</script>

<template>
  <div v-if="(service instanceof HistoryService)" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 py-12">
    <div v-for="data in service.getRepository()" :key="data._id" class="grid p-4 bg-base-100 rounded-md aspect-video">
      <div class="grid gap-2 grid-rows-[max-content_1fr_max-content]">
        <div class="grid-cols-[1fr_max-content] grid justify-between">
          <div class="text-xl xl:text-3xl">
            {{ data.org }}
          </div>
          <div>
            <div>
              {{ data.location }}
            </div>
            <div class="grid grid-flow-col justify-start items-center gap-1">
              <Icon name="solar:calendar-bold-duotone" />
              <div class="text-neutral text-xs">
                {{ data.getDateToLocaleString(useLocale()).join(` ● `) }}
              </div>
            </div>
          </div>
        </div>
        <div class="relative">
          <div class="inset-0 line-clamp-2 overflow-hidden text-ellipsis">
            {{ data.getTruncatedDescription(200) }}
          </div>
        </div>
        <div class="flex justify-between items-end">
          <div class="text-xs">
            <Icon name="gg:alarm" /> {{ data.getLocaleReadingTime() }}
          </div>
          <Btn color="light" :to="localePath({ name:`experience-item`, params: { item: data.org } })">
            {{ $t('see_more') }}
          </Btn>
        </div>
      </div>
    </div>
  </div>
</template>

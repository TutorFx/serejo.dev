<script setup lang="ts">
import ProjectRepository from '~/utils/cms/project/ProjectRepository'
import ProjectService from '~/utils/cms/project/ProjectService'

const { data } = await getProject()
const service = computed(() => (data.value instanceof ProjectRepository) && getProjectService(data.value))
</script>

<template>
  <div>
    <div v-if="(service instanceof ProjectService)" class="grid grid-cols-2 max-w-3xl mx-auto gap-6">
      <div v-for="item in service.getRepository()" :key="item._id" class="aspect-square bg-base-100 rounded-lg grid grid-rows-[max-content_1fr]">
        <div class="p-6 grid gap-3">
          <div class="text-3xl text-center">
            {{ item.title }}
          </div>
          <div class="text-center text-balance mx-auto">
            <MDC :value="item" />
          </div>
          <div class="grid items-center grid-flow-col justify-center gap-3">
            <NuxtLink v-if="item.github" :href="item.github">
              <Icon size="28" name="mdi:github"/>
            </NuxtLink>
            <NuxtLink v-if="item.url" :href="item.url">
              <Icon size="24" name="mage:external-link"/>
            </NuxtLink>
          </div>
        </div>
        <div>

        </div>
      </div>
    </div>
  </div>
</template>

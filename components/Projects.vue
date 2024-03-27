<script setup lang="ts">
import ProjectService from '~/utils/cms/project/ProjectService'

const { data } = getProject()
const service = computed(() => data.value && getProjectService(data.value))
</script>

<template>
  <div>
    <div v-if="(service instanceof ProjectService)">
      <div v-for="item in service.getRepository()" :key="item._id">
        <div>
          {{ item.title }}
        </div>
      </div>
    </div>
  </div>
</template>

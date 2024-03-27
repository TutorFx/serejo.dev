<script setup lang="ts">
import ProjectRepository from '~/utils/cms/project/ProjectRepository';
import ProjectService from '~/utils/cms/project/ProjectService'

const { data } = await getProject()
const service = computed(() => (data.value instanceof ProjectRepository) && getProjectService(data.value))
</script>

<template>
  <div>
    {{ service }}
    <div v-if="(service instanceof ProjectService)">
      <div v-for="item in service.getRepository()" :key="item._id">
        <div>
          {{ item.title }}
        </div>
      </div>
    </div>
  </div>
</template>

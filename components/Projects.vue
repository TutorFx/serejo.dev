<script setup lang="ts">
import ProjectRepository from '~/utils/cms/project/ProjectRepository'
import ProjectService from '~/utils/cms/project/ProjectService'

const { data } = await getProject()
const service = computed(() => (data.value instanceof ProjectRepository) && getProjectService(data.value))
</script>

<template>
  <div>
    <div v-if="(service instanceof ProjectService)" class="grid lg:grid-cols-3 mx-auto gap-6 grid-cols-1 min-[650px]:grid-cols-2">
      <div v-for="item in service.getRepository()" :key="item._id">
        <ProjectsCard :item />
      </div>
    </div>
  </div>
</template>

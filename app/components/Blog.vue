<script setup lang="ts">
import BlogRepository from '../../app/utils/cms/blog/BlogRepository'
import BlogService from '../../app/utils/cms/blog/BlogService'

const { data } = await getBlog()
const service = computed(() => (data.value instanceof BlogRepository) && getBlogService(data.value))

const localePath = useLocalePath()
</script>

<template>
  <div>
    <div v-if="(service instanceof BlogService)" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <NuxtLink
        v-for="value in service.blog.getSortedRepository()"
        :key="value._id" :to="localePath({ name: `post-item`, params: { item: value.filename } })"
        class="border border-accent rounded-xl py-2 px-4 bg-base-100"
      >
        <BlogItem v-hoverable:blog :value />
      </NuxtLink>
    </div>
  </div>
</template>

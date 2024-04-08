<script setup lang="ts">
import BlogRepository from '~/utils/cms/blog/BlogRepository'
import BlogService from '~/utils/cms/blog/BlogService'

const { data } = await getBlog()
const service = computed(() => (data.value instanceof BlogRepository) && getBlogService(data.value))

const localePath = useLocalePath()
</script>

<template>
  <div>
    <div v-if="(service instanceof BlogService)" class="grid gap-4 lg:grid-cols-3 md:grid-cols-2">
      <NuxtLink v-for="value in service.blog.getSortedRepository()" :key="value._id" :to="localePath({ name: `post-item`, params: { item: value.filename } })">
        <BlogItem :value />
      </NuxtLink>
    </div>
  </div>
</template>

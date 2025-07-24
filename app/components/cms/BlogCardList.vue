<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

const { data: posts } = useFetch<BlogPostsDto[]>('/api/posts', {
  query: {
    lang: locale.value
  }
})
</script>

<template>
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 py-12">
    <NuxtLink v-if="posts" v-for="(post, key) in posts" :key :to="localePath({ name:'post-item', params: { item: post.slug || post.path } })" >
      <CmsBlogPostCard v-if="post" v-bind="post" />
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">
import BlogItemService from '@/utils/cms/blog/BlogItemService'

const route = useRoute()
const { data } = await getBlogItem((route.params as { item: string }).item)
const BlogItem = computed(() => data.value && new BlogItemService(data.value))

if (BlogItem.value && BlogItem.value instanceof BlogItemService) {
  useHead({
    title: BlogItem.value.getItem().title,
    meta: [
      { name: 'description', content: BlogItem.value.getItem().getBodyAsPlain() },
    ],
  })
}
</script>

<template>
  <div>
    <div v-if="(BlogItem instanceof BlogItemService)">
      <BlogArticle :value="BlogItem.getItem()" />
    </div>
  </div>
</template>

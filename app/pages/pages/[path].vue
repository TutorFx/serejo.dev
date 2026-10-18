<script setup lang="ts">
const route = useRoute()
// Content paths have no locale prefix (route.path is /pt-BR/pages/... in pt-BR)
const { data: page } = await useAsyncData(`pages-${route.params.path}`, () => {
  return queryCollection('pages').path(`/pages/${route.params.path}`).first()
})
</script>

<template>
  <div>
    <div class="grid grid-rows-[max-content_1fr] gap-4">
      <UIContainer class="grid items-start gap-3 [&_>_div]:grid [&_>_div]:gap-3">
        <ContentRenderer v-if="page" :value="page" />
      </UIContainer>
    </div>
  </div>
</template>

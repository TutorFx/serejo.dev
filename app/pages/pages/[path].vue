<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('pages').path(route.path).first()
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

<script setup lang="ts">
defineI18nRoute({
  paths: {    
    'en-US': '/blog',
    'pt-BR': '/blog',
  }
})
</script>

<template>
  <div class="grid items-center bg-base-200">
    <UIContainer>
      <CmsBlogCardList />
    </UIContainer>
  </div>
</template>

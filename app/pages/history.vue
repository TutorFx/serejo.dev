<script setup lang="ts">
defineI18nRoute({
  paths: {
    'en-US': '/my-trajectory',
    'pt-BR': '/minha-jornada',
  },
})
</script>

<template>
  <div class="grid items-center bg-base-200">
    <UIContainer>
      <CmsExperienceCardList />
    </UIContainer>
  </div>
</template>

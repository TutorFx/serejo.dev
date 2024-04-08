<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: t('menu.blog'),
})
</script>

<template>
  <Container class="py-24">
    <Blog />
  </Container>
</template>

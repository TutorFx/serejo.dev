<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: t('menu.blog'),
})

/* defineOgImage({
  component: 'default',
}) */
</script>

<template>
  <div class="bg-base-300">
    <Container class="py-24 grid gap-6">
      <div>
        <h2 class="text-3xl">
          Blog
        </h2>
      </div>
      <Blog />
    </Container>
  </div>
</template>

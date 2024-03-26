<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
})
</script>

<template>
  <div class="grid gap-3">
    <NuxtLink v-for="(item, i) in availableLocales" :key="i" :to="switchLocalePath(item.code)" class="flex items-center gap-3">
      <Icon size="32" :name="useFlag(item.code)" /> <span>{{ item.name }}</span>
    </NuxtLink>
  </div>
</template>

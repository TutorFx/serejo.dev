<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
})

const getFlag = (countryLang: string) => {

  const countryCode = countryLang.split('-').at(-1)?.toLowerCase()

  if (!countryCode) {
    throw createError({ statusCode: 404, statusMessage: 'Invalid country lang: ' + countryLang }) 
  }
  return `circle-flags:${countryCode}`
}
</script>

<template>
  <div class="grid gap-3">
    <NuxtLink v-for="(locale, i) in availableLocales" :key="i" :to="switchLocalePath(locale.code)" class="flex items-center gap-3">
      <Icon size="32" :name="getFlag(locale.code)" /> <span>{{ locale.name }}</span>
    </NuxtLink>
  </div>
</template>
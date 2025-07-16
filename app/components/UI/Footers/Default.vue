<script setup lang="ts">
const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()
</script>

<template>
  <footer class="bg-base-100 text-center py-8 text-lg font-bold text-base-content">
    <div class="grid gap-3">
      <div>
        {{ t('copyright') }} ©2024 — {{ (new Date()).getFullYear() }}
      </div>
    </div>
    <div>
      {{ runtimeConfig.public.name }} {{ runtimeConfig.public.version }}
    </div>
  </footer>
</template>
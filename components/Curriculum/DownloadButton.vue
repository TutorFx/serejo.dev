<script setup lang="ts">
const analytics = useAnalytics()
</script>

<template>
  <div>
    <a
      href="/api/GenerateCurriculum.pdf"
      download="Gabriel Serejo Curriculum"
      @click="analytics.trackDownload()"
    >
      <Btn v-hoverable:download class="relative z-50 translate-x-1">
        {{ $t('download_curriculum') }}
      </Btn>
    </a>
  </div>
</template>

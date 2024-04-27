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
      <Btn v-hoverable:download class="z-50 relative translate-x-1">
        {{ $t('download_curriculum') }}
      </Btn>
    </a>
  </div>
</template>

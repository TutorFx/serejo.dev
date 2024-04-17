<template>
  <div>
    <a href="/api/GenerateCurriculum.pdf" download="Gabriel Serejo Curriculum">
      <Btn v-hoverable:download class="z-50 relative translate-x-1">
        {{ $t('download_curriculum') }}
      </Btn>
    </a>
  </div>
</template>

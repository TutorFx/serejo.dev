<template>
  <div>
    <a href="/api/GenerateCurriculum.pdf" download="Gabriel Serejo Curriculum">
      <Btn class="z-50 relative translate-x-1" v-hoverable:download>
        {{ $t('download_curriculum') }}
      </Btn>
    </a>
  </div>
</template>

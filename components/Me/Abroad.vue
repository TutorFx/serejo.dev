<template>
  <div class="relative z-[-2] bg-base-300 overflow-hidden">
    <div class="relative">
      <div class="-z-[1] absolute left-[10%] -top-[30%]">
        <div class="max-w-0 max-h-0">
          <div
            class="w-[80vw] aspect-video bg-base-100 -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-80"
          />
        </div>
      </div>
      <div class="-z-[1] absolute right-[0%] bottom-[10%]">
        <div class="max-w-0 max-h-0">
          <div
            class="w-[80vw] aspect-video bg-base-100 -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-80"
          />
        </div>
      </div>
      <Container class="!max-w-6xl text-center py-12 md:py-24 text-xl md:text-3xl relative z-[1]">
        <MDC :value="$t('me.abroad')" />
      </Container>
    </div>
  </div>
</template>

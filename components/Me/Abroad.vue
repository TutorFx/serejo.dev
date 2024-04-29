<template>
  <div class="bg-base-300 relative overflow-hidden">
    <div class="relative">
      <div class="absolute left-[10%] -top-[30%] -z-[1]">
        <div class="max-h-0 max-w-0">
          <div
            class="bg-base-100 aspect-video w-[80vw] rounded-full opacity-80 blur-3xl -translate-x-[50%] -translate-y-[50%]"
          />
        </div>
      </div>
      <div class="absolute bottom-[10%] right-[0%] -z-[1]">
        <div class="max-h-0 max-w-0">
          <div
            class="bg-base-100 aspect-video w-[80vw] rounded-full opacity-80 blur-3xl -translate-x-[50%] -translate-y-[50%]"
          />
        </div>
      </div>
      <Container>
        <div class="relative z-[1] grid gap-6 py-12 text-center !max-w-6xl md:py-24">
          <div>
            <MDC class="text-xl md:text-3xl" :value="$t('me.abroad')" />
          </div>
          <div>
            <CurriculumDownloadButton />
          </div>
        </div>
      </Container>
    </div>
  </div>
</template>

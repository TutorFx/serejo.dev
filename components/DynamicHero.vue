<template>
  <div class="relative overflow-hidden p-12 rounded-t-3xl">
    <div class="-z-[1] absolute left-[50%] bottom-[50%]">
      <div class="max-w-0 max-h-0">
        <div
          class="rounded-full aspect-video -translate-x-[50%] -translate-y-[50%] blur-3xl w-[60vw] bg-brand-gradient opacity-10"
        />
      </div>
    </div>
    <div class="-z-[1] absolute left-[90%] bottom-[90%]">
      <div class="max-w-0 max-h-0">
        <div
          class="aspect-video bg-brand-gradient -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl w-[30vw] opacity-80 md:opacity-30"
        />
      </div>
    </div>
    <div class="-z-[1] absolute left-[0%] bottom-[10%]">
      <div class="max-w-0 max-h-0">
        <div
          class="w-[30vw] aspect-video -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-80 md:opacity-30 bg-vue-gradient"
        />
      </div>
    </div>
    <div class="-z-[1] absolute right-[0%] bottom-[25%]">
      <div class="max-w-0 max-h-0">
        <div
          class="w-[60vw] aspect-video -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl bg-rose-400 opacity-20 md:opacity-10"
        />
      </div>
    </div>
    <div class="-z-[1] absolute left-[0%] top-[10%]">
      <div class="max-w-0 max-h-0">
        <div
          class="w-[60vw] aspect-video -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-20 bg-primary"
        />
      </div>
    </div>
    <slot />
  </div>
</template>

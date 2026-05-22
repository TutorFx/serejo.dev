<script setup lang="ts">
defineProps <{
  title?: string
  description?: string
  readingTime?: string
}> ()

function removeInvalidChars(text: string) {
  return text.replace(/([\u2700-\u27BF\uE000-\uF8FF\u2011-\u26FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD10-\uDDFF])/g, '')
}
</script>

<template>
  <div class="relative grid bg-stone-950">
    <div class="absolute inset-0 flex opacity-20">
      <div class="top-[-50%] right-[-50%] size-200 rounded-full bg-[#9233ea] shadow-xl blur-[200px]" />
    </div>
    <div class="absolute inset-0 flex opacity-20">
      <div class="bottom-[-50%] left-[-50%] size-300 rounded-full bg-[#B5179E] shadow-xl blur-[100px]" />
    </div>
    <div
      class="flex h-[740px] flex-wrap justify-between p-10"
      data-theme="dark"
    >
      <div class="text-6xl font-bold text-white">
        {{ title }}
      </div>
      <div class="grid grow">
        <div class="line-clamp-3 flex-wrap overflow-hidden text-3xl text-stone-300">
          {{ description ? removeInvalidChars(description) : '' }}
        </div>
      </div>
      <div class="flex w-full flex-wrap items-start justify-between gap-6 text-3xl text-stone-300">
        <div class="flex items-center gap-3">
          <Icon mode="svg" name="gg:alarm" /> {{ readingTime }}
        </div>
        <div class="text-4xl font-bold">
          SEREJO.DEV
        </div>
      </div>
    </div>
  </div>
</template>

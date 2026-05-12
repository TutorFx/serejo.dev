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
  <div class="grid relative bg-stone-950">
    <div class="absolute flex inset-0 opacity-20">
      <div class="rounded-full shadow-xl size-200 top-[-50%] right-[-50%] bg-[#9233ea] blur-[200px]" />
    </div>
    <div class="absolute flex inset-0 opacity-20">
      <div class="rounded-full shadow-xl left-[-50%] bottom-[-50%] bg-[#B5179E] size-300 blur-[100px]" />
    </div>
    <div
      class="flex flex-wrap justify-between h-[740px] p-10"
      data-theme="dark"
    >
      <div class="text-white font-bold text-6xl">
        {{ title }}
      </div>
      <div class="grid grow">
        <div class="text-3xl flex-wrap text-stone-300 line-clamp-3 overflow-hidden">
          {{ description ? removeInvalidChars(description) : '' }}
        </div>
      </div>
      <div class="flex flex-wrap gap-6 text-3xl justify-between items-start text-stone-300 w-full">
        <div class="flex gap-3 items-center">
          <Icon mode="svg" name="gg:alarm" /> {{ readingTime }}
        </div>
        <div class="text-4xl font-bold">
          SEREJO.DEV
        </div>
      </div>
    </div>
  </div>
</template>

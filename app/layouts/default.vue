<template>
  <div class="bg-base-100 text-base-content min-h-full grid grid-rows-[max-content_1fr_max-content]">
    <UIHeadersCoreHeader :list="useMenu(NAVBAR_CONTENT)"/>
    <NuxtPage />
    <LazyCurriculumHandler />
    <LazyChat hydrate-on-interaction />
    <UIFootersDefault />
  </div>
</template>
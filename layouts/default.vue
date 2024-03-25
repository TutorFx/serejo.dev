<template>
  <main class="grid min-h-dvh grid-rows-[max-content_1fr_max-content]">
    <Header />
    <slot />
    <Footer />
  </main>
</template>

<style>
::view-transition-old(hero),
::view-transition-new(hero) {
  width: auto;
  animation-duration: 0.5s;
  transition: all;
}
</style>

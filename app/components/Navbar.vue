<template>
  <UDashboardNavbar
    class="absolute inset-x-0 top-0 z-10 border-b-0 backdrop-blur-sm sm:px-4"
    :ui="{ left: 'min-w-0' }"
  >
    <template #left>
      <slot name="title" />
    </template>

    <template #right>
      <slot />

      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-circle-plus"
        to="/chat"
        class="lg:hidden"
        aria-label="New chat"
      />
    </template>
  </UDashboardNavbar>
</template>

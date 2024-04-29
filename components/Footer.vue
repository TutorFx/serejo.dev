<template>
  <footer class="bg-base-100 text-base-content py-8 text-center text-lg font-bold">
    <div class="grid gap-3">
      <div class="flex justify-center">
        <ClientOnly>
          <DarkToggle size="28" />
          <template #fallback>
            <div class="bg-base-300 bg-skeleton-gradient animate-skeleton h-6 w-64 rounded-lg" />
          </template>
        </ClientOnly>
      </div>
      <div>
        {{ $t('copyright') }} ©2024 — {{ (new Date()).getFullYear() }}
      </div>
    </div>
    <div>
      {{ $config.public.name }} {{ $config.public.version }}
    </div>
  </footer>
</template>

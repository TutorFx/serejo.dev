<template>
  <footer class="bg-base-100 py-8 text-center text-lg font-bold text-base-content">
    <div class="grid gap-3">
      <div class="justify-center flex">
        <ClientOnly>
          <DarkToggle size="28" />
          <template #fallback>
            <div class="bg-base-300 h-6 w-64 rounded-lg bg-skeleton-gradient animate-skeleton" />
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

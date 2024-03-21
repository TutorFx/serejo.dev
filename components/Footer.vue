<template>
  <footer class="bg-base-100 py-8 text-center text-lg font-bold text-base-content">
    <div class="grid gap-3">
      <div>
        <DarkToggle size="28" />
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

<template>
  <div class="bg-base-200">
    <UIContainer class="py-6">
      <div class="min-h-82 grid items-center">
        <div class="grid gap-6">
          <div class="text-lg md:text-xl">
            <MDC :value="$t('me.abroad')" />
          </div>
          <div class="mx-auto">
            <UIButton target="_blank" :to="$localePath({ name: 'curriculum', query: { print: null } })">
              {{ $t('download_curriculum') }}
            </UIButton>
          </div>
        </div>
      </div>
    </UIContainer>
  </div>
</template>

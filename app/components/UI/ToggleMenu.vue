<script setup lang="ts">
const model = defineModel<boolean>({ default: false })
const { t } = useI18n()
</script>

<template>
  <!-- A real button, so the mobile menu also opens from the keyboard; hidden once the menu fits -->
  <button
    type="button"
    class="focus-visible:outline-primary grid items-center rounded-md focus-visible:outline-2 lg:hidden"
    :aria-label="t('navigation.menu')"
    :aria-expanded="model"
    @click="model = !model"
  >
    <Icon v-if="model" size="28" name="line-md:close-small" />
    <Icon v-else size="28" name="line-md:menu" />
  </button>
</template>

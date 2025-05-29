<script setup lang="ts">
const props = defineProps<{ label: string, message: string }>()

const config = useRuntimeConfig()

const whatsappLink = computed(() => `https://wa.me/${config.public.phoneNumber}?text=${encodeURIComponent(props.message)}`)
</script>

<template>
  <Btn :href="whatsappLink">
    <div class="gap-3 items-center inline-flex">
      <span>{{ label }}</span><Icon size="20" name="prime:whatsapp" />
    </div>
  </Btn>
</template>

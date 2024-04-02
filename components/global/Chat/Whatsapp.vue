<script setup lang="ts">
const config = useRuntimeConfig()

const props = defineProps<{ label: string, message: string }>() 
const whatsappLink = computed(() => `https://wa.me/${config.public.phoneNumber}?text=${encodeURIComponent(props.message)}`) 
</script>

<template>
    <Btn :href="whatsappLink"><div class="inline-flex gap-3 items-center"><span>{{ label }}</span><Icon size="20" name="prime:whatsapp" /></div></Btn>
</template>

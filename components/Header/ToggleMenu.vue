<template>
    <div @click="model = !model">
        <Icon size="32" v-if="!model" keepalive name="line-md:menu" />
        <Icon size="32" v-else keepalive name="line-md:menu-to-close-alt-transition"  />
    </div>
</template>

<script setup lang="ts">
const model = defineModel<boolean>()
</script>
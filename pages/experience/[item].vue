<template>
    <div>
        {{ item.data }}
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const item = getHistoryItem(route.params.item)
</script>
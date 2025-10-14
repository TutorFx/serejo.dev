<script lang="ts" setup>
definePageMeta({
  layout: 'none',
  colorMode: 'light',
})

const route = useRoute()

onMounted(()=> {
  if ('print' in route.query) {
    nextTick(() => {
      setTimeout(() => {
        window.print()
      }, 100)
    })
  }
})
</script>

<template>
  <Curriculum />
</template>

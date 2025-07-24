<script setup lang="ts">
const localePath = useLocalePath()
const { visible } = useCurriculum()

const cvBody = useTemplateRef('curriculum')

watch(cvBody, () => {
  if (cvBody.value instanceof HTMLIFrameElement) {
    cvBody.value.onload = () => {
      cvBody.value?.contentWindow?.print()
    }
  }
})

</script>

<template>
  <teleport to="body">
    <iframe v-if="visible" :src="localePath({ name: 'curriculum' })" ref="curriculum" class="absolute top-0 left-0 w-[210mm] z-50 h-full hidden" />
  </teleport>
</template>
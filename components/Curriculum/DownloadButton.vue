<script lang="ts" setup>

const curriculum = ref<HTMLElement>()

</script>

<template>
    <div>
        <div ref="curriculum" class="sr-only">
            <CurriculumMain />
        </div>
        <Btn>
            {{ $t('download_curriculum') }}
        </Btn>
    </div>
</template>

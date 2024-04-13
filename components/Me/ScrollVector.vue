<script setup lang="ts">
const { $gsap } = useNuxtApp();

const { y } = useWindowScroll()

const direction = ref(1)
const rotation = ref(0)
const wheel = ref<HTMLElement | null>(null)
const isMounted = ref(false)

const applyRotation = computed(() => wheel.value ? $gsap.quickTo(wheel.value, 'rotation', {
    duration: 0.6,
    ease: "power5"
}) : () => null )

function ticker ( time: number, timeDelta: number ) {
    rotation.value += ((timeDelta * .01) * direction.value)
    applyRotation.value(rotation.value + (y.value * .5))
}

$gsap.ticker.add(ticker);

onMounted(() => {
    isMounted.value = true
})

onBeforeUnmount(() => {
    $gsap.ticker.remove(ticker);
});

watch(() => y.value, (after, before) => {
    direction.value = after > before ? -1 : 1
})

</script>

<template>
    <div class="relative" :class="{ 'animate-[spin_10s_linear_infinite]': !isMounted }" ref="wheel">
        <div class="absolute">
            <VectorsCircularText class="translate-y-[-50%] translate-x-[-50%] text-primary scale-125" />
        </div>
    </div>
</template>

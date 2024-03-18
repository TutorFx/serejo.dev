<template>
    <div>
        <div class="py-6 relative overflow-hidden rounded-t-3xl">
            <div class="absolute right-[30%] top-[25%]">
                <div class="max-w-0 max-h-0">
                    <Icon name="Sparkle" size="48" class="size-6 md:size-8 lg:size-10 -translate-x-[50%] -translate-y-[50%]" />
                </div>
            </div>
            <div class="absolute left-[50%] bottom-[25%]">
                <div class="max-w-0 max-h-0">
                    <Icon name="SparkleOutline" size="48" class="size-6 md:size-8 lg:size-10 -translate-x-[50%] -translate-y-[50%]" />
                </div>
            </div>
            <div class="-z-[1] absolute left-[50%] bottom-[50%]">
                <div class="max-w-0 max-h-0">
                    <div class="w-[60vw] aspect-video bg-brand-gradient -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-10" />
                </div>
            </div>
            <div class="-z-[1] absolute left-[90%] bottom-[90%]">
                <div class="max-w-0 max-h-0">
                    <div class="w-[30vw] aspect-video bg-brand-gradient -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-80 md:opacity-30" />
                </div>
            </div>
            <div class="-z-[1] absolute left-[0%] bottom-[10%]">
                <div class="max-w-0 max-h-0">
                    <div class="w-[30vw] aspect-video bg-vue-gradient -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-80 md:opacity-30" />
                </div>
            </div>
            <div class="-z-[1] absolute left-[0%] top-[10%]">
                <div class="max-w-0 max-h-0">
                    <div class="w-[60vw] aspect-video -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-20 bg-primary" />
                </div>
            </div>
            <Container>
                <div class="grid justify-center items-center py-24 md:py-32 lg:py-48">
                    <div>
                        <div class="text-3xl md:text-6xl lg:text-7xl grid gap-3 ">
                            <div class="leading-snug">&#123; Open sourceror &</div>
                            <div class="pl-6 md:pl-10 lg:pl-12 grid grid-flow-col items-end gap-6">
                                <div class="grid items-end justify-end relative -mt-6">
                                    <NuxtImg size="128"
                                        class="object-contain p-2 lg:p-4 !pb-0 w-16 md:w-24 lg:w-32 drop-shadow-lg"
                                        src="/brand/Vue.js.svg" />
                                    <div
                                        class="-z-[1] h-6 md:h-10 lg:h-12 -mt-[100%] w-16 md:w-24 lg:w-32 rounded-md md:rounded-lg lg:rounded-xl bg-vue-gradient" />
                                </div>
                                <div>
                                    Desenvolvedor
                                </div>
                            </div>
                            <div class="pl-3 grid grid-flow-col justify-start items-end gap-6">
                                <div>
                                    Experiente
                                </div>
                                <div class="grid items-end justify-end relative -mt-6">
                                    <NuxtImg size="128"
                                        class="object-contain p-2 lg:p-4 !pb-0 w-16 md:w-24 lg:w-32 drop-shadow-lg"
                                        src="/brand/me.png" />
                                    <div
                                        class="-z-[1] h-6 md:h-10 lg:h-12 -mt-[100%] w-16 md:w-24 lg:w-32 rounded-md md:rounded-lg lg:rounded-xl bg-brand-gradient" />
                                </div>
                                <div>
                                    &#125;
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    </div>
</template>

<script lang="ts" setup>

</script>
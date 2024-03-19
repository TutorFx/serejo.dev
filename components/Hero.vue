<template>
    <div class="overflow-hidden rounded-t-3xl">
        <div class="pt-6 relative">
            <div class="-z-[1] absolute left-[50%] bottom-[50%]">
                <div class="max-w-0 max-h-0">
                    <div
                        class="w-[60vw] aspect-video bg-brand-gradient -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-10" />
                </div>
            </div>
            <div class="-z-[1] absolute left-[90%] bottom-[90%]">
                <div class="max-w-0 max-h-0">
                    <div
                        class="w-[30vw] aspect-video bg-brand-gradient -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-80 md:opacity-30" />
                </div>
            </div>
            <div class="-z-[1] absolute left-[0%] bottom-[10%]">
                <div class="max-w-0 max-h-0">
                    <div
                        class="w-[30vw] aspect-video bg-vue-gradient -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-80 md:opacity-30" />
                </div>
            </div>
            <div class="-z-[1] absolute left-[0%] top-[10%]">
                <div class="max-w-0 max-h-0">
                    <div
                        class="w-[60vw] aspect-video -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-20 bg-primary" />
                </div>
            </div>
            <Container>
                <div class="grid justify-center items-center py-24 md:py-32 lg:py-48">
                    <div class="relative">
                        <div class="absolute -right-[0%] -top-[10%]">
                            <div class="max-w-0 max-h-0">
                                <Icon name="Sparkle" size="48"
                                    class="size-6 md:size-8 lg:size-10 -translate-x-[50%] -translate-y-[50%]" />
                            </div>
                        </div>
                        <div class="absolute left-[50%] -bottom-[20%]">
                            <div class="max-w-0 max-h-0">
                                <Icon name="SparkleOutline" size="48"
                                    class="size-6 md:size-8 lg:size-10 -translate-x-[50%] -translate-y-[50%]" />
                            </div>
                        </div>
                        <div class="text-[7vw] md:text-6xl lg:text-7xl xl:text-9xl grid gap-1 lg:gap-3 [text-shadow:_6px_1px_50px_var(--fallback-b1,oklch(var(--b1)/1))]">
                            <div class="leading-snug">&#123; Open sourceror &</div>
                            <div class="pl-6 md:pl-10 lg:pl-12 grid grid-flow-col items-end gap-6">
                                <div class="grid items-end justify-end relative -mt-6">
                                    <NuxtImg size="176"
                                        class="object-contain p-2 lg:p-4 !pb-0 w-16 md:w-24 lg:w-32 xl:w-48 drop-shadow-[20px_5px_10px_var(--fallback-b1,oklch(var(--b1)/.3))]"
                                        src="/brand/Vue.js.svg" />
                                    <div
                                        class="-z-[1] h-6 md:h-10 lg:h-12 xl:h-20 -mt-[100%] w-16 md:w-24 lg:w-32 xl:w-48 rounded-md md:rounded-lg lg:rounded-xl bg-vue-gradient" />
                                </div>
                                <div class="leading-snug">
                                    Desenvolvedor
                                </div>
                            </div>
                            <div class="pl-3 md:pl-16 lg:pl-20 xl:pl-32 grid grid-flow-col justify-start items-end gap-6">
                                <div class="leading-snug">
                                    Experiente
                                </div>
                                <div class="grid items-end justify-end relative -mt-6">
                                    <NuxtImg size="176"
                                        class="object-contain p-2 lg:p-4 !pb-0 w-16 md:w-24 lg:w-32 xl:w-48 drop-shadow-[20px_5px_10px_var(--fallback-b1,oklch(var(--b1)/.3))]"
                                        src="/brand/me.png" />
                                    <div
                                        class="-z-[1] h-6 md:h-10 lg:h-12 xl:h-20 -mt-[100%] w-16 md:w-24 lg:w-32 xl:w-48 rounded-md md:rounded-lg lg:rounded-xl bg-brand-gradient" />
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
        <div>
            <Icon name="HeroLine" size="100%" class="relative z-[-2] -mt-20 -mb-[20%] md:-mt-[20%] lg:-mt-[20%] lg:-mb-[30%] w-[90%]" />
            <div class="border-b border-neutral opacity-50" />
            <div class="relative">
                <div class="absolute top-0 inset-x-[-100%] bg-base-100 z-[-2] blur-2xl bottom-[-100%]">

                </div>
                <container class="py-6 font-light">
                    <div>
                        Olá! Sou desenvolvedor web há vários anos. Vários frameworks e bibliotecas são divertidas de se
                        trabalhar com. Se eu puder escolher, minha stack dos sonhos é Vue, Nuxt, Typescript e Tailwind.
                    </div>
                </container>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

</script>
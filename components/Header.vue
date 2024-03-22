<template>
    <Container>
        <div ref="startMenu">
            <HeaderNav :service="service" v-model="menu" />
        </div>

        <Transition 
            enter-from-class="-translate-y-[150%]" 
            enter-active-class="transition duration-500">
            <div v-if="!visible"
                class="inset-x-0 top-0 fixed z-50 bg-base-100 rounded-b-3xl bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-90 border border-base-100">
                <Container>
                    <HeaderNav :service="service" v-model="menu" />
                </Container>
            </div>
        </Transition>

        <Teleport to="body">
            <Container v-if="menu" class="inset-0 fixed z-50 bg-base-100">
                <div class="grid grid-rows-[max-content_1fr] min-h-dvh">
                    <HeaderNav :service="service" v-model="menu" />
                    <div>
                        <div class="py-12 grid">
                            <h6>{{ $t('navigation.menu') }}</h6>
                            <HeaderMobileMenu class="py-6" @click.capture="closeMenu" :service="service" />
                            <h6>{{ $t('navigation.settings') }}</h6>
                            <div class="py-6 grid justify-start gap-4">
                                <DarkToggle size="32" />
                                <LanguageSelector @click.capture="closeMenu" />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Teleport>
    </Container>
</template>

<script lang="ts" setup>
const service = useNavbar()
const menu = useScrollLock(document);
const startMenu = ref();
const visible = ref(false);

useIntersectionObserver(
    startMenu,
    ([{ isIntersecting }]) => {
        visible.value = isIntersecting
    },
)

const closeMenu = () => menu.value = false;
</script>
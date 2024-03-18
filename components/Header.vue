<template>
    <Container>
        <HeaderNav :service="service" v-model="menu" />

        <Teleport to="body">
            <Container v-if="menu" class="inset-0 absolute z-50 bg-base-100">
                <div class="grid grid-rows-[max-content_1fr] min-h-dvh">
                    <HeaderNav :service="service" v-model="menu" />
                    <div>
                        <div class="py-12 grid">
                            <h6>Menu</h6>
                            <HeaderMobileMenu @click.capture="closeMenu" :service="service" />
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

const closeMenu = () => menu.value = false;
</script>
<script lang="ts" setup>
const service = useNavbar()
const menu = useScrollLock(document?.body)
const startMenu = ref()
const visible = ref(false)

useIntersectionObserver(
  startMenu,
  ([{ isIntersecting }]) => {
    visible.value = isIntersecting
  },
)

function toggleMenu() {
  menu.value = !menu.value
}
</script>

<template>
  <Container>
    <div ref="startMenu">
      <HeaderNav v-model="menu" :service="service" />
    </div>

    <Transition
      enter-from-class="-translate-y-[150%]"
      enter-active-class="transition duration-500"
    >
      <div
        v-if="!visible"
        class="fixed bg-base-100 top-0 z-50 inset-x-0 rounded-b-3xl bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-90 border border-base-100"
      >
        <Container>
          <HeaderNav v-model="menu" :service="service" />
        </Container>
      </div>
    </Transition>

    <Teleport to="body">
      <Container v-if="menu" class="fixed z-50 bg-base-100 inset-0">
        <div class="grid min-h-dvh grid-rows-[max-content_1fr]">
          <HeaderNav v-model="menu" :service="service" />
          <div>
            <div class="grid py-12">
              <h6>{{ $t('navigation.menu') }}</h6>
              <HeaderMobileMenu class="py-6" :service="service" @click="toggleMenu()" />
              <h6>{{ $t('navigation.settings') }}</h6>
              <div class="py-6 grid justify-start gap-4">
                <DarkToggle size="32" />
                <LanguageSelector @click="toggleMenu()" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Teleport>
  </Container>
</template>

<script lang="ts" setup>
const service = useNavbar()
const menu = useScrollLock(document?.body)
const startMenu = ref()
const visible = ref(false)
const route = useRoute()

const { stop } = useIntersectionObserver(
  startMenu,
  (entries) => {
    const entry = entries[0]
    if (entry && entry.isIntersecting !== undefined) {
      visible.value = entry.isIntersecting
    }
  },
)

watch(() => route.name, () => {
  stop()
})

function toggleMenu() {
  menu.value = !menu.value
}
</script>

<template>
  <Container>
    <div ref="startMenu">
      <HeaderNav v-model="menu" :service="service" />
    </div>

    <Transition enter-from-class="-translate-y-[150%]" enter-active-class="transition duration-500">
      <div
        v-if="!visible"
        class="bg-base-100 border fixed top-0 z-50 rounded-b-3xl inset-x-0 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-90 border-base-100"
      >
        <Container>
          <HeaderNav v-model="menu" :service="service" />
        </Container>
      </div>
    </Transition>

    <Teleport to="body">
      <Container v-if="menu" class="fixed z-50 bg-base-100 inset-0">
        <div class="grid grid-rows-[max-content_1fr] min-h-dvh">
          <HeaderNav v-model="menu" :service="service" />
          <div>
            <div class="grid py-12">
              <h6>{{ $t('navigation.menu') }}</h6>
              <HeaderMobileMenu class="py-6" :service="service" @click="toggleMenu()" />
              <h6>{{ $t('navigation.settings') }}</h6>
              <div class="py-6 grid gap-4 justify-start">
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

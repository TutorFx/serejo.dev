<script lang="ts" setup>
const service = useNavbar()
const menu = useScrollLock(document?.body)
const startMenu = ref()
const visible = ref(false)
const route = useRoute()

const { stop } = useIntersectionObserver(
  startMenu,
  ([{ isIntersecting }]) => {
    visible.value = isIntersecting
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
        class="bg-base-100 border-base-100 fixed inset-x-0 top-0 z-50 border rounded-b-3xl bg-opacity-90 bg-clip-padding backdrop-blur-lg backdrop-filter"
      >
        <Container>
          <HeaderNav v-model="menu" :service="service" />
        </Container>
      </div>
    </Transition>

    <Teleport to="body">
      <Container v-if="menu" class="bg-base-100 fixed inset-0 z-50">
        <div class="grid grid-rows-[max-content_1fr] min-h-dvh">
          <HeaderNav v-model="menu" :service="service" />
          <div>
            <div class="grid py-12">
              <h6>{{ $t('navigation.menu') }}</h6>
              <HeaderMobileMenu class="py-6" :service="service" @click="toggleMenu()" />
              <h6>{{ $t('navigation.settings') }}</h6>
              <div class="grid justify-start gap-4 py-6">
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

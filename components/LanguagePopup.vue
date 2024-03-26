<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const menu = useScrollLock(document)
const target = ref(null)

function toggleLangSelector() {
  menu.value = !menu.value
}

onClickOutside(target, toggleLangSelector)
</script>

<template>
  <div class="relative">
    <Icon v-bind="$attrs" :name="useFlag($i18n.locale)" @click="toggleLangSelector" />
    <Teleport to="body">
      <Transition enter-from-class="opacity-0" enter-active-class="transition duration-500">
        <div v-if="!!menu" class="fixed inset-0 bg-base-300/50 z-50">
          <div enter-from-class="translate-x-[150%] entering" enter-active-class="transition duration-500">
            <div ref="target" class="absolute top-24 right-0 bg-base-100 rounded-l-xl">
              <div class="relative">
                <div class="absolute">
                  <Icon
                    name="mdi:close" class="bg-primary rounded-full relative -translate-x-[25%] -translate-y-[25%]"
                    size="24"
                    @click="toggleLangSelector"
                  />
                </div>
                <LanguageSelector @click.capture="toggleLangSelector" class="p-4" />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

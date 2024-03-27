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
        <div v-if="!!menu" class="fixed inset-0 z-50 bg-base-300/50">
          <div enter-from-class="translate-x-[150%] entering" enter-active-class="transition duration-500">
            <div ref="target" class="absolute bg-base-100 top-24 right-0 rounded-l-xl">
              <div class="relative">
                <div class="absolute">
                  <Icon
                    name="mdi:close" class="bg-primary rounded-full relative -translate-x-[25%] -translate-y-[25%]"
                    size="24"
                    @click="toggleLangSelector"
                  />
                </div>
                <LanguageSelector class="p-4" @click.capture="toggleLangSelector" />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

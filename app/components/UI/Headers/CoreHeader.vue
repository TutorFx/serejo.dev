<script lang="ts">
import type { CoreHeaderBaseProps } from './CoreHeader/CoreHeaderBase.vue'

export type CoreHeaderProps = CoreHeaderBaseProps
</script>

<script setup lang="ts">
defineProps<CoreHeaderProps>()
const { t } = useI18n()

const menuState = ref(false)
</script>

<template>
  <div>
    <UIContainer>
      <UIHeadersCoreHeaderBase v-model="menuState" :list />
      <teleport to="body">
        <div v-if="menuState" class="bg-base-100 text-base-content absolute inset-0 z-50">
          <UIContainer class="grid h-full grid-rows-[max-content_max-content_1fr]">
            <UIHeadersCoreHeaderBase v-model="menuState" :list />
            <div class="border-base-300 border-b" />
            <div class="grid items-center">
              <div class="grid">
                <div>
                  <div class="grid text-start">
                    <div>{{ t('navigation.menu') }}</div>
                    <div>
                      <UINavigationMenu
                        class="gap-3 px-0"
                        size="xl"
                        direction="horizontal"
                        :list
                        @click="menuState = false"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div class="grid text-start">
                    <div>{{ t('navigation.settings') }}</div>
                    <div class="px-1 py-3">
                      <UILocaleButton />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UIContainer>
        </div>
      </teleport>
    </UIContainer>
  </div>
</template>

<script lang="ts">
import type { CoreHeaderBaseProps } from './CoreHeader/CoreHeaderBase.vue'

export interface CoreHeaderProps extends CoreHeaderBaseProps {

}
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
          <UIContainer class="h-full grid grid-rows-[max-content_max-content_1fr]">
            <UIHeadersCoreHeaderBase v-model="menuState" :list />
            <div class="border-b border-base-300" />
            <div class="grid items-center">
              <div class="grid">
                <div>
                  <div class="grid text-start">
                    <div>{{ t('navigation.menu') }}</div>
                    <div><UINavigationMenu class="gap-3 px-0" size="xl" direction="horizontal" :list @click="menuState = false" /></div>
                  </div>
                </div>
                <div>
                  <div class="grid text-start">
                    <div>{{ t('navigation.settings') }}</div>
                    <div class="py-3 px-1">
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

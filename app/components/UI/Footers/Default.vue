<script setup lang="ts">
const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()
const LocalePathFunction = useLocalePath()
</script>

<template>
  <footer class="bg-base-100 grid">
    <UIContainer class="grid grid-flow-col justify-between py-24">
      <div class="grid gap-6">
        <NuxtLink :to="LocalePathFunction({ name: 'index' })" class="font-logo text-2xl">
          Gabriel S.
        </NuxtLink>
        <div class="grid grid-flow-col justify-start gap-3">
          <div>
            <UIPopover>
              <template #content>
                Email
              </template>
              <UIButton
                class="text-3xl"
                icon="mdi:alternate-email"
                variant="link"
                href="mailto:gabrielserejo11@gmail.com"
              />
            </UIPopover>
          </div>
          <div>
            <UIPopover>
              <template #content>
                Github
              </template>
              <UIButton
                class="text-3xl"
                icon="mdi:github"
                variant="link"
                href="https://github.com/TutorFx"
              />
            </UIPopover>
          </div>
          <div>
            <UIPopover>
              <template #content>
                Linkedin
              </template>
              <UIButton
                class="text-3xl"
                icon="mdi:linkedin"
                variant="link"
                href="https://www.linkedin.com/in/gabrielserejo/"
              />
            </UIPopover>
          </div>
        </div>
        <div class="grid justify-start">
          <UIButton variant="link" :to="{ name: 'pages-path___en-US', params: { path: 'politicas-de-privacidade' } }">
            Políticas de privacidade
          </UIButton>
          <UIButton variant="link" href="mailto:gabrielserejo11@gmail.com">
            Contato
          </UIButton>
        </div>
      </div>
      <div />
    </UIContainer>
    <div class="text-base-content py-8 text-center text-lg font-bold">
      <div class="grid gap-3">
        <div>
          {{ t('copyright') }} ©2024 — {{ (new Date()).getFullYear() }}
        </div>
      </div>
      <div>
        {{ runtimeConfig.public.name }} {{ runtimeConfig.public.version }}
      </div>
    </div>
  </footer>
</template>

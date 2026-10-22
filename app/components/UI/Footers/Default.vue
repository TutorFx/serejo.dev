<script setup lang="ts">
const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()
const LocalePathFunction = useLocalePath()
// Kept in the payload so prerendered pages hydrate with the year they were rendered with
const copyrightYear = useState('copyright-year', () => new Date().getFullYear())
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
              <template #content> Email </template>
              <UIButton
                class="text-3xl"
                icon="mdi:alternate-email"
                variant="link"
                href="mailto:gabrielserejo11@gmail.com"
                aria-label="Email"
              />
            </UIPopover>
          </div>
          <div>
            <UIPopover>
              <template #content> Github </template>
              <UIButton
                class="text-3xl"
                icon="mdi:github"
                variant="link"
                href="https://github.com/TutorFx"
                aria-label="GitHub"
              />
            </UIPopover>
          </div>
          <div>
            <UIPopover>
              <template #content> Linkedin </template>
              <UIButton
                class="text-3xl"
                icon="mdi:linkedin"
                variant="link"
                href="https://www.linkedin.com/in/gabrielserejo/"
                aria-label="LinkedIn"
              />
            </UIPopover>
          </div>
        </div>
        <div class="grid justify-start">
          <UIButton
            variant="link"
            :to="LocalePathFunction({ name: 'pages-path', params: { path: 'politicas-de-privacidade' } })"
          >
            {{ t('footer.privacy_policy') }}
          </UIButton>
          <UIButton variant="link" href="mailto:gabrielserejo11@gmail.com">
            {{ t('footer.contact') }}
          </UIButton>
        </div>
      </div>
      <div />
    </UIContainer>
    <div class="text-base-content py-8 text-center text-lg font-bold">
      <div class="grid gap-3">
        <div>{{ t('copyright') }} ©2024 — {{ copyrightYear }}</div>
      </div>
      <div>{{ runtimeConfig.public.name }} {{ runtimeConfig.public.version }}</div>
    </div>
  </footer>
</template>

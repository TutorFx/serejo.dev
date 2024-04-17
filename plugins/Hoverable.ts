import { FeatureFlags } from '~/utils/flags/Flags';

export default defineNuxtPlugin((nuxtApp) => {


  nuxtApp.vueApp.directive('hoverable', (el: HTMLElement, { arg }) => {
    const store = useFeatureFlagsStore()
    if (store.features.check(FeatureFlags.CURSOR)) {
      const emitter = useEmitter()
      const { isOutside } = useMouseInElement(el)
      watch(() => isOutside.value, (isInactive) => {
        const modifier = arg as unknown as string
        const signal = `${modifier}:${+ !isInactive}`
        emitter.emit('pointer', signal);
      })
    }
  })
})

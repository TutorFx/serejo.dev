import { FeatureFlags } from '~/utils/flags/Flags'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('hoverable', {
    
    mounted (el, { arg }) {
      const { isOutside, stop } = useMouseInElement(el)
      const store = useFeatureFlagsStore()
      if (store.features.check(FeatureFlags.CURSOR)) {
        const emitter = useEmitter()
        watch(() => isOutside.value, (isInactive) => {
          const modifier = arg as unknown as string
          const signal = `${modifier}:${+!isInactive}`
          emitter.emit('pointer', signal)
        })
      }
      el._stop = stop
    },
    unmounted(el) {
      // Unregister the event listener in the 'unmounted' hook
      el._stop();
    },
  })
})

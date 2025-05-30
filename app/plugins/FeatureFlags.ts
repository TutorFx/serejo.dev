import { acceptHMRUpdate, defineStore } from 'pinia'
import { FeatureFlags } from '~/utils/flags/Flags'
import FlagsController from '~/utils/flags/FlagsController'
import FlagsRepository from '~/utils/flags/FlagsRepository'

export default defineNuxtPlugin(() => {
  const device = useDevice()

  const featureStore = defineStore('FeatureFlags', () => {
    const features = new FlagsRepository([
      new FlagsController(FeatureFlags.CHAT, true, false),
      new FlagsController(FeatureFlags.CURSOR, false/* device.isDesktop */, false),
    ])

    return {
      features,
    }
  })

  if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(featureStore, import.meta.hot))

  featureStore()

  return {
    provide: {
      featureStore,
    },
  }
})

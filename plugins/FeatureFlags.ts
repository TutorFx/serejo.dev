import { acceptHMRUpdate, defineStore } from 'pinia'
import { FeatureFlags } from '~/utils/flags/Flags'
import FlagsController from '~/utils/flags/FlagsController'
import FlagsRepository from '~/utils/flags/FlagsRepository'

export default defineNuxtPlugin(() => {
  const featureStore = defineStore('FeatureFlags', () => {
    const features = new FlagsRepository([
      new FlagsController(FeatureFlags.CHAT, true, false),
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

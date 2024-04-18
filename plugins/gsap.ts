import { gsap } from 'gsap'

// Define the Nuxt plugin

export default defineNuxtPlugin(() => {
  onBeforeRouteLeave(() => {
    gsap.killTweensOf('*')
  })
  return { provide: { gsap } }
})

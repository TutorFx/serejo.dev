import { gsap } from 'gsap'

// Define the Nuxt plugin

export default defineNuxtPlugin(() => {
  return { provide: { gsap } }
})

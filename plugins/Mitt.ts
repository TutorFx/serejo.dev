import mitt from 'mitt'

const emitter = mitt<{
  pointer: string
}>()

export default defineNuxtPlugin(() => {
  return { provide: { emitter } }
})

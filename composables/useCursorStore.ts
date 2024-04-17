import { acceptHMRUpdate, defineStore } from 'pinia'
import type { ICursor } from '~/config/cursor'
import { Cursor } from '~/config/cursor'

export const useCursorStore = defineStore('cursor', () => {
  const mitt = useEmitter()
  const pointer = ref<null | ICursor>(null)
  mitt.on('pointer', (a) => {
    const value = a.split(':')

    if (!value)
      return

    const kind = value[0]
    const status = Boolean(Number.parseInt(value[1]))

    if (!status)
      return pointer.value = null

    pointer.value = Cursor.find(item => item.name === kind) ?? null
  })

  useEventListener(document, 'mousedown', () => {
    pointer.value = null
  })

  return {
    pointer,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCursorStore, import.meta.hot))

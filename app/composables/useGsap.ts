import { gsap } from 'gsap'
import DrawSVGPlugin from 'gsap/DrawSVGPlugin'

export function useGsap(callback?: () => void, scope?: Element | string | object) {
  gsap.registerPlugin(DrawSVGPlugin)

  const ctx = gsap.context(() => {}, scope)

  onMounted(() => {
    if (callback)
      ctx.add(callback, scope)
  })

  onUnmounted(() => {
    ctx.revert()
  })

  return {
    ctx,
    revert: ctx.revert,
    add: ctx.add,
  }
}

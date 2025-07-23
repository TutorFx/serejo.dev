import { promiseTimeout, useTimeout } from '@vueuse/core'

export function useCurriculum(){
  const { ready, start, stop } = useTimeout(1000, { controls: true })

}
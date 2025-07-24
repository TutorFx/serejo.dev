import { promiseTimeout, useTimeout } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'

let timeout: undefined | NodeJS.Timeout = undefined
const visible = shallowRef<boolean>(false)

export function useCurriculum() {
  function download() {
    visible.value = true
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      visible.value = false
    }, 1000)
  }

  return { download, visible }
}
let timeout: undefined | NodeJS.Timeout
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

export default function () {
  const nuxtApp = useNuxtApp()
  const { $featureStore } = nuxtApp
  return $featureStore()
}

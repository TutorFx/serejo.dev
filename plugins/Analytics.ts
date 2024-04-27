
export default defineNuxtPlugin((nuxtApp) => {
    const route = useRoute()
    const analytics = useAnalytics()
    nuxtApp.hook('app:rendered', () => {
        analytics.viewPage()
    })
    watch(() => route.fullPath, () => {
        analytics.viewPage()
    })
})

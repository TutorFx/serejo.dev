export function useGreeting() {
  const { t } = useI18n()
  const { user } = useUserSession()

  // The visitor's time zone is only known in the browser, so SSR and hydration render the neutral greeting
  const hour = ref<number | null>(null)

  onMounted(() => {
    hour.value = new Date().getHours()
  })

  return computed(() => {
    let key = 'chat.greeting.evening'
    if (hour.value === null) key = 'chat.greeting.hello'
    else if (hour.value < 12) key = 'chat.greeting.morning'
    else if (hour.value < 18) key = 'chat.greeting.afternoon'

    const greeting = t(key)
    const name = user.value?.name?.split(' ')[0] || user.value?.username

    return name ? t('chat.greeting.with_name', { greeting, name }) : greeting
  })
}

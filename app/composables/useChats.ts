import { format, isToday, isYesterday, parseISO, subMonths } from 'date-fns'

export interface UIChat {
  id: string
  label: string
  icon: string
  createdAt: string
}

export function useChats(chats: Ref<UIChat[] | undefined>) {
  const { t, locale } = useI18n()

  const groups = computed(() => {
    // Group chats by date
    const today: UIChat[] = []
    const yesterday: UIChat[] = []
    const lastWeek: UIChat[] = []
    const lastMonth: UIChat[] = []
    const older: Record<string, UIChat[]> = {}

    const oneWeekAgo = subMonths(new Date(), 0.25) // ~7 days ago
    const oneMonthAgo = subMonths(new Date(), 1)

    chats.value?.forEach((chat) => {
      const chatDate = new Date(chat.createdAt)

      if (isToday(chatDate)) {
        today.push(chat)
      } else if (isYesterday(chatDate)) {
        yesterday.push(chat)
      } else if (chatDate >= oneWeekAgo) {
        lastWeek.push(chat)
      } else if (chatDate >= oneMonthAgo) {
        lastMonth.push(chat)
      } else {
        // Sortable key: "2023-01", "2023-02", etc.
        const monthKey = format(chatDate, 'yyyy-MM')

        if (!older[monthKey]) {
          older[monthKey] = []
        }

        older[monthKey].push(chat)
      }
    })

    // Sort older chats by month in descending order (newest first)
    const sortedMonthKeys = Object.keys(older).sort().reverse()

    // Format: "January 2023" (en-US), "janeiro de 2023" (pt-BR), etc.
    const monthFormatter = new Intl.DateTimeFormat(locale.value, { month: 'long', year: 'numeric' })

    // Create formatted groups for navigation
    const formattedGroups = [] as Array<{
      id: string
      label: string
      items: Array<UIChat>
    }>

    // Add groups that have chats
    if (today.length) {
      formattedGroups.push({
        id: 'today',
        label: t('chat.history.today'),
        items: today
      })
    }

    if (yesterday.length) {
      formattedGroups.push({
        id: 'yesterday',
        label: t('chat.history.yesterday'),
        items: yesterday
      })
    }

    if (lastWeek.length) {
      formattedGroups.push({
        id: 'last-week',
        label: t('chat.history.last_week'),
        items: lastWeek
      })
    }

    if (lastMonth.length) {
      formattedGroups.push({
        id: 'last-month',
        label: t('chat.history.last_month'),
        items: lastMonth
      })
    }

    // Add each month group
    sortedMonthKeys.forEach((monthKey) => {
      if (older[monthKey]?.length) {
        formattedGroups.push({
          id: monthKey,
          label: monthFormatter.format(parseISO(monthKey)),
          items: older[monthKey]
        })
      }
    })

    return formattedGroups
  })

  return {
    groups
  }
}

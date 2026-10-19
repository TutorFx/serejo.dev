export function useMenu(menuData: MenuList<InternalRoute>): ComputedRef<MenuList<FinalRoute>> {
  const localePath = useLocalePath()
  const { locale } = useI18n()

  function localizeMenu(list: MenuList<InternalRoute>): MenuList<FinalRoute> {
    return list.map(item => {
      const localizedItem = { ...item }

      if ('to' in localizedItem && localizedItem.to) {
        const parsedRoute = localePath(localizedItem.to as FinalRoute, locale.value)
        if (parsedRoute) {
          localizedItem.to = parsedRoute
        }
      }

      if (localizedItem.children) {
        localizedItem.children = localizeMenu(localizedItem.children)
      }

      return localizedItem as MenuItem<FinalRoute>
    })
  }

  return computed(() => localizeMenu(menuData))
}

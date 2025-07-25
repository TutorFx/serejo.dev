export function useMenu(menuData: MenuList<InternalRoute>): MenuList<FinalRoute> {
  const localePath = useLocalePath()

  return menuData.map((item) => {
    if ('to' in item && item.to) {
      const parsedRoute = localePath(item.to as FinalRoute)
      if (parsedRoute) {
        item.to = parsedRoute
      }
    }

    if ('children' in item && item.children) {
      item.children = useMenu(item.children)
    }

    return item as MenuItem<FinalRoute>
  })
}

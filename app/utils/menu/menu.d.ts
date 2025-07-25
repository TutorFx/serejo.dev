export type Direction = (typeof DIRECTION)[keyof typeof DIRECTION]

export interface InternalLink<T> {
  to: T
}

export interface ExternalLink {
  href: string
}

export interface MenuItemBase {
  label: string
  icon?: string
  children?: MenuList
}

export type MenuItem<T> = MenuItemBase & (InternalLink<T> | ExternalLink)
export type MenuList<T extends InternalRoute | FinalRoute = InternalRoute> = MenuItem<T>[]

export interface MenuVariantContract {
  size: GenericVariantKeyDefinition<ComponentSize>
  direction: GenericVariantKeyDefinition<Direction>
}

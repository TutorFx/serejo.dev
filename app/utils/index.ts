import type { RouteLocationAsRelativeI18n, RouteLocationRawI18n, RouteNamedMapI18n } from 'vue-router'

export * from './_core/core.d'
export * from './button/button.d'
export * from './menu/menu.d'
export * from './card/card.d'
export * from './chat/chat.d'

export type GenericVariantKeyDefinition<T extends string> = Record<T, string | undefined>
export type BooleanKeyDefinition = Record<`${boolean}`, string | undefined>

export type InternalRoute = RouteLocationRawI18n
export type FinalRoute = keyof RouteNamedMapI18n

export type RouteLocationI18nGenericPath = Omit<RouteLocationAsRelativeI18n, 'path'> & {
  path?: string
}

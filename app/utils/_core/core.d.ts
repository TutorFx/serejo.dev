export type ComponentSize = (typeof CORE_SIZE)[keyof typeof CORE_SIZE]
export type ComponentColor = (typeof CORE_COLORS)[keyof typeof CORE_COLORS]

export interface CoreVariant {
  size: GenericVariantKeyDefinition<ComponentSize>
  color: GenericVariantKeyDefinition<ComponentColor>
}

export interface CoreProps {
  size?: ComponentSize
  color?: ComponentColor
}

export type ButtonVariant = (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS]

export interface ButtonVariantContract extends CoreVariant {
  rounded: BooleanKeyDefinition
  block: BooleanKeyDefinition
  variant: GenericVariantKeyDefinition<ButtonVariant>
  isActive: BooleanKeyDefinition
  loading: BooleanKeyDefinition
}

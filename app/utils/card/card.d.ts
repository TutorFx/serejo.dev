export type CardVariant = (typeof CARD_VARIANTS)[keyof typeof CARD_VARIANTS];

export interface CardVariantContract{
  rounded: BooleanKeyDefinition
  border: BooleanKeyDefinition
  variant: GenericVariantKeyDefinition<CardVariant>
}
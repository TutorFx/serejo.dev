export const CARD_DEFAULT_KEY = 'default';

export const CARD_VARIANTS = {
  DEFAULT: CARD_DEFAULT_KEY,
} as const;

export const DEFAULT_CARD_VARIANT = CARD_VARIANTS.DEFAULT;
export const CARD_VARIANTS_ARRAY = Object.values(CARD_VARIANTS);
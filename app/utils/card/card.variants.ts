import { tv } from 'tailwind-variants'

export const genericCard = tv({
  slots: {
    base: 'bg-base-100 grid',
    content: 'p-3',
    header: 'p-3 font-bold text-2xl',
    footer: 'p-3',
  },
  variants: {
    variant: {
      [CARD_VARIANTS.DEFAULT]: '',
    },
    rounded: {
      true: 'rounded-xl',
      false: undefined,
    },
    border: {
      true: 'border divide-y divide-[var(--border)] border-[var(--border)]',
      false: undefined,
    },
  } satisfies CardVariantContract,
  defaultVariants: {
    rounded: true,
    border: true,
    variant: CARD_VARIANTS.DEFAULT,
  },
})

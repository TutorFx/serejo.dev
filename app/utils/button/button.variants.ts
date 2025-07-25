import { tv } from 'tailwind-variants'

export const button = tv({
  slots: {
    base: 'flex gap-1 font-semibold rounded-lg text-sm [--text:theme(color.base.100)] [--bg:theme(color.base.content)]',
    wrapper: 'text-center flex-1',
    trailing: 'grid items-center',
    leading: 'grid items-center',
  },
  variants: {
    size: {
      [CORE_SIZE.XS]: 'text-xs py-1 px-2 font-light',
      [CORE_SIZE.SM]: 'text-sm py-1 px-3 font-light',
      [CORE_SIZE.MD]: 'text-base py-2 px-4 font-light',
      [CORE_SIZE.LG]: 'text-lg py-2 px-5 font-light',
      [CORE_SIZE.XL]: 'text-3xl py-3 px-6 font-medium',
    },
    color: {
      [CORE_COLORS.PRIMARY]: '[--color:theme(color.primary)]',
      [CORE_COLORS.SECONDARY]: '[--color:theme(color.secondary)]',
    },
    variant: {
      [BUTTON_VARIANTS.LINK]: 'px-1 py-1 [&_.wrapper]:text-start decoration-[var(--color)] hover:underline hover:decoration-wavy group-hover:underline group-hover:decoration-wavy',
      [BUTTON_VARIANTS.DEFAULT]: 'bg-[var(--color)] text-[var(--text)] font-bold',
    },
    rounded: {
      true: 'rounded-full',
      false: undefined,
    },
    block: {
      true: 'block',
      false: undefined,
    },
    isActive: {
      true: undefined,
      false: undefined,
    },
    loading: {
      true: undefined,
      false: undefined,
    },
  } satisfies ButtonVariantContract,
  defaultVariants: {
    size: DEFAULT_SIZE,
    color: DEFAULT_COLOR,
    variant: BUTTON_DEFAULT_VARIANT,
  },
  compoundVariants: [
    {
      variant: BUTTON_VARIANTS.LINK,
      isActive: true,
      class: 'underline decoration-wavy',
    },
  ],
})

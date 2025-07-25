import { tv } from 'tailwind-variants'

export const menu = tv({
  slots: {
    base: 'grid font-semibold rounded-lg text-sm gap-3',
  },
  variants: {
    size: {
      [CORE_SIZE.XS]: 'text-xs py-1 px-2',
      [CORE_SIZE.SM]: 'text-sm py-1 px-3',
      [CORE_SIZE.MD]: 'text-base py-2 px-4',
      [CORE_SIZE.LG]: 'text-lg py-2 px-5',
      [CORE_SIZE.XL]: 'text-xl py-3 px-6',
    },
    direction: {
      [DIRECTION.HORIZONTAL]: '',
      [DIRECTION.VERTICAL]: 'grid-flow-col',
    },
  } satisfies MenuVariantContract,
  defaultVariants: {
    size: DEFAULT_SIZE,
    direction: DIRECTION.HORIZONTAL,
  },
})

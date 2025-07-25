import { tv } from 'tailwind-variants'

export const genericChat = tv({
  slots: {
    base: 'grid overflow-hidden bg-base-300 grid-rows-[max-content_1fr_max-content] shadow-xl max-h-[80vh] pointer-events-auto sm:w-lg',
    content: 'overflow-auto',
    header: 'p-4 grid gap-3 items-center bg-base-100 text-base-content grid-cols-[max-content_1fr]',
    footer: 'p-4 grid border-t border-t-base-100',
  },
  variants: {
    variant: {
      [CHAT_VARIANTS.DEFAULT]: '',
    },
    rounded: {
      true: 'rounded-lg',
      false: undefined,
    },
    border: {
      true: undefined,
      false: undefined,
    },
  } satisfies ChatVariantContract,
  defaultVariants: {
    rounded: true,
    border: true,
    variant: CHAT_VARIANTS.DEFAULT,
  },
})

export const genericChatMessage = tv({
  slots: {
    base: 'p-2 px-4 grid rounded-lg',
    content: 'grid gap-4',
  },
  variants: {
    variant: {
      [AGENT_TYPE.AI]: 'bg-base-100 mr-auto rounded-bl-none',
      [AGENT_TYPE.USER]: 'bg-[var(--brand-5)] text-white ml-auto rounded-br-none',
    },
  } satisfies ChatMessageVariantContract,
  defaultVariants: {
    variant: AGENT_TYPE.USER,
  },
})

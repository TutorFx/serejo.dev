export const CHAT_DEFAULT_KEY = 'default'

export const CHAT_VARIANTS = {
  DEFAULT: CHAT_DEFAULT_KEY,
} as const

export const DEFAULT_CHAT_VARIANT = CHAT_VARIANTS.DEFAULT
export const CHAT_VARIANTS_ARRAY = Object.values(CHAT_VARIANTS)

const MESSAGE_STATUS_IDLE = 'idle'
const MESSAGE_STATUS_STREAMING = 'streaming'
const MESSAGE_STATUS_PENDING = 'pending'
const MESSAGE_STATUS_SUCCESS = 'success'
const MESSAGE_STATUS_ERROR = 'error'

export const MESSAGE_STATUS = {
  IDLE: MESSAGE_STATUS_IDLE,
  PENDING: MESSAGE_STATUS_PENDING,
  SUCCESS: MESSAGE_STATUS_SUCCESS,
  STREAMING: MESSAGE_STATUS_STREAMING,
  ERROR: MESSAGE_STATUS_ERROR,
} as const

// 'idle' | 'pending' | 'success' | 'error'

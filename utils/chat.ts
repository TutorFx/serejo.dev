import Chat from '@/utils/chat/Chat'

export function getChat() {
  return reactive(new Chat())
}

import Chat from './chat/Chat'

export function getChat() {
  return reactive(new Chat())
}

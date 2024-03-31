import type { Content } from '@google/generative-ai'

import type User from './entities/Agent/User'
import type Bot from './entities/Agent/Bot'
import Message from './entities/Message'

export default class <T extends Message<User & Bot>> {
  messages

  constructor(messages: T[] = []) {
    this.messages = messages
  }

  getMessages() {
    return this.messages
  }

  pushMessage(message: T) {
    if (message instanceof Message)
      return this.messages.push(message)

    return null
  }

  getGoogleHistory() {
    return this.messages.map(m => ({
      role: m.agent.role,
      parts: [{ text: m.message }]
    } as Content))
  }
}

import { FetchError } from 'ofetch'
import type { Content } from '@google/generative-ai'

import MessageRepository from './MessageRepository'
import Message from './entities/Message'
import User from './entities/Agent/User'
import Bot from './entities/Agent/Bot'

export default class {
  messageRepository
  analytics

  constructor(messages: Message<User & Bot>[] = []) {
    this.messageRepository = new MessageRepository(messages)
    this.analytics = useAnalytics()
  }

  getMessages() {
    return this.messageRepository.getMessages()
  }

  getGoogleContents(): Content[] {
    return this.messageRepository.getGoogleFormat()
  }

  async sendMessage(message: string) {
    const user = new User()
    const bot = new Bot()

    this.messageRepository.pushMessage(new Message(user, message))

    try {
      const response = await $fetch('/api/Chatbot', {
        method: 'POST',
        body: this.serialize(),
      })

      if (!response || typeof response.data !== 'string')
        return

      this.messageRepository.pushMessage(new Message(bot, response.data))
      this.analytics.trackChatMessage(message)
    }
    catch (e) {
      if (e instanceof FetchError)
        console.warn('Erro')
    }
  }

  serialize() {
    return JSON.stringify({
      ...this,
    })
  }
}

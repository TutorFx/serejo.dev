import type { Content } from '@google/generative-ai'

import MessageRepository from './MessageRepository'
import User from './entities/Agent/User'
import Message from './entities/Message'

export default class {
  messageRepository

  constructor() {
    this.messageRepository = new MessageRepository()
  }

  getMessages() {
    return this.messageRepository.getMessages()
  }

  getGoogleContents(): Content[] {
    return this.messageRepository.getGoogleHistory()
  }

  sendMessage(message: string) {
    const user = new User()
    this.messageRepository.pushMessage(new Message(user, message))
  }
}

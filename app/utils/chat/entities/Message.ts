/* eslint style/type-generic-spacing: 0 */
import { MessageSchema } from '../schemas'
import type AbstractAgent from './AbstractAgent'

export default class <T extends AbstractAgent> {
  message: string
  agent: T

  constructor(agent: T, message: string) {
    MessageSchema.parse({ agent, message })

    this.agent = agent
    this.message = message
  }

  toString() {
    return this.message
  }
}

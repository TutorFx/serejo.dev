import type AbstractAgent from './AbstractAgent'

export default class <T extends AbstractAgent> {
  message: string
  agent: T

  constructor(agent: T, message: string) {
    this.agent = agent
    this.message = message
  }

  toString() {
    return this.message
  }
}

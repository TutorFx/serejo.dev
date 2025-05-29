import AbstractAgent from '~/utils/chat/entities/AbstractAgent'
import { AgentType } from '~/utils/chat/schemas'

export default class extends AbstractAgent {
  constructor() {
    super({ name: 'Robot', role: AgentType.Ai })
  }
}

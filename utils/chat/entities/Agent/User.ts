import { AgentType } from '@/utils/chat/schemas'
import AbstractAgent from '~/utils/chat/entities/AbstractAgent'

export default class extends AbstractAgent {
  constructor() {
    super({ name: 'you', role: AgentType.User })
  }
}

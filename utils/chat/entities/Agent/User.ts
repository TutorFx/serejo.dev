import AbstractOperator from '../AbstractAgent'
import { AgentType } from '@/utils/chat/schemas'

export default class extends AbstractOperator {
  constructor() {
    super({ name: 'you', role: AgentType.User })
  }
}

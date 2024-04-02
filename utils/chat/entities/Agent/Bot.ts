import AbstractOperator from '../AbstractAgent'
import { AgentType } from '@/utils/chat/schemas'

export default class extends AbstractOperator {
  constructor() {
    super({ name: 'Robot', role: AgentType.Ai })
  }
}

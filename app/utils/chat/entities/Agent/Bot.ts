import { AgentType } from '../../schemas'
import AbstractOperator from '../AbstractAgent'


export default class extends AbstractOperator {
  constructor() {
    super({ name: 'Robot', role: AgentType.Ai })
  }
}

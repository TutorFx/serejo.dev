import type { IAbstractAgent } from '../types'
import { AbstractAgentSchema } from '../schemas'

export default abstract class {
  name
  role

  constructor(operator: IAbstractAgent) {
    AbstractAgentSchema.parse(operator)

    this.name = operator.name
    this.role = operator.role
  }
}

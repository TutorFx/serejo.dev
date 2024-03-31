import type { IAbstractAgent } from '../types'

export default abstract class {
  name;
  image;
  role;

  constructor(operator: IAbstractAgent) {
    this.name = operator.name
    this.image = operator.image
    this.role = operator.role
  }
}

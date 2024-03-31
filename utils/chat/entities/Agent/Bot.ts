import AbstractOperator from '../AbstractAgent'

export default class extends AbstractOperator {
  constructor() {
    super({ image: '', name: 'Robot', role: 'model' })
  }
}

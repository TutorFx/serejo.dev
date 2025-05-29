import type CmsController from './CmsController'

export default abstract class<T extends CmsController> {
  private repository: T[]

  constructor(repository: T[]) {
    this.repository = repository
  }

  getRepository = () => this.repository
}

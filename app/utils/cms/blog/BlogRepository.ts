import CmsRepository from '../CmsRepository'
import type BlogController from './BlogController'

export default class extends CmsRepository<BlogController> {
  getSortedRepository = () => this.getRepository().sort((a, b) => {
    const aTime = new Date(a.createdAt)
    const bTime = new Date(b.createdAt)

    return bTime.getTime() - aTime.getTime()
  })

  constructor(repository: BlogController[]) {
    super(repository)
  }
}

import CmsRepository from '../CmsRepository'
import type HistoryController from './HistoryController'

export default class extends CmsRepository<HistoryController> {
  getSortedRepository = () => this.getRepository().sort((a, b) => {
    const aTime = new Date(a.start)
    const bTime = new Date(b.start)

    return bTime.getTime() - aTime.getTime()
  })

  getItemByIndex = (i: number) => {
    const repository = this.getSortedRepository()

    if (i < 0 || i >= repository.length)
      throw createError({ statusCode: 404, statusMessage: 'Error finding history item, please try again.' })

    return repository[i]
  }

  constructor(repository: HistoryController[]) {
    super(repository)
  }
}

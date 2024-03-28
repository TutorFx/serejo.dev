import type HistoryRepository from './HistoryRepository'

export default class {
  repository: HistoryRepository
  constructor(repository: HistoryRepository) {
    this.repository = repository
  }

  getRepository() {
    return this.repository.getSortedRepository()
  }

  getItemByIndex(i: number) {
    return this.repository.getItemByIndex(i)
  }
}

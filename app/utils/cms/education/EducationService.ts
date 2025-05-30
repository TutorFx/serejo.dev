import type EducationRepository from './EducationRepository'

export default class {
  repository: EducationRepository
  constructor(repository: EducationRepository) {
    this.repository = repository
  }

  getRepository() {
    return this.repository.getSortedRepository()
  }

  getItemByIndex(i: number) {
    return this.repository.getItemByIndex(i)
  }
}

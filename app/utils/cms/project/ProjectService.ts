import type ProjectRepository from './ProjectRepository'

export default class {
  repository: ProjectRepository

  constructor(repository: ProjectRepository) {
    this.repository = repository
  }

  getRepository() {
    return this.repository.getRepository()
  }
}

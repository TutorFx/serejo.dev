import CmsRepository from '../CmsRepository'
import type ProjectController from './ProjectController'

export default class extends CmsRepository<ProjectController> {
  constructor(project: ProjectController[]) {
    super(project)
  }
}

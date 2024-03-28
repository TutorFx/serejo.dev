import type { ProjectEntry } from '../types'
import { ProjectEntrySchema } from '../schemas'
import CmsController from '../CmsController'

export default class extends CmsController {
  url: string
  github?: string

  constructor(project: ProjectEntry) {
    super(project)
    ProjectEntrySchema.parse(project)
    this.url = project.url
    this.github = project.github
  }
}

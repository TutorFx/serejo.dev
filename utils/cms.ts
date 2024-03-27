import { fromZodError } from 'zod-validation-error'
import { ZodError } from 'zod'
import HistoryController from './cms/history/HistoryController'
import HistoryRepository from './cms/history/HistoryRepository'
import HistoryService from './cms/history/HistoryService'

import ProjectController from './cms/project/ProjectController'
import ProjectRepository from './cms/project/ProjectRepository'
import ProjectService from './cms/project/ProjectService'

import type { HistoryEntry, ProjectEntry } from './cms/types'

export function getHistoryItem(org: string) {
  return useAsyncData(
    'HistoryItemFetcher',
    () => queryContent<HistoryEntry>(useLocale(), 'history').where({ org }).findOne().then(entry => reactive(new HistoryController(entry))),
  )
}

export const getHistoryService = (repository: HistoryRepository) => new HistoryService(repository)

export const getProjectService = (repository: ProjectRepository) => new ProjectService(repository)

/* export function getHistory() {
  return useAsyncData(
    'HistoryFetcher',
    () => queryContent<HistoryEntry>(useLocale(), 'history').find().then(data =>
      new HistoryRepository(data.map(entry => reactive(new HistoryController(entry)))),
    ),
  )
} */

export function getProject() {
  return useAsyncData(
    'ProjectFetcher',
    () => queryContent<ProjectEntry>(useLocale(), 'project').find().then(data => {
        const instances = data.map((entry) => {
          try {
            return reactive(new ProjectController(entry))
          }
          catch (e) {
            if (e instanceof ZodError) {
              const validationError = fromZodError(e)
              console.warn(entry._path, validationError.toString())
            }
            return null
          }
        }).filter(Boolean) as ProjectController[]
        return new ProjectRepository(instances)
      }
    ),
  )
}

export function getHistory() {
  return useAsyncData(
    'HistoryFetcher',
    () => queryContent<HistoryEntry>(useLocale(), 'history').find().then((data) => {
      const instances = data.map((entry) => {
        try {
          return reactive(new HistoryController(entry))
        }
        catch (e) {
          if (e instanceof ZodError) {
            const validationError = fromZodError(e)
            console.warn(entry._path, validationError.toString())
          }
          return null
        }
      }).filter(Boolean) as HistoryController[]
      return new HistoryRepository(instances)
    }),
  )
}

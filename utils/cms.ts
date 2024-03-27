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
    () => queryContent<ProjectEntry>(useLocale(), 'project').find().then(data =>
      processArray(data, ProjectController, ProjectRepository),
    ),
  )
}

export function getHistory() {
  return useAsyncData(
    'HistoryFetcher',
    () => queryContent<HistoryEntry>(useLocale(), 'history').find().then(data =>
      processArray(data, HistoryController, HistoryRepository),
    ),
  )
}

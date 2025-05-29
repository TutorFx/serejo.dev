import BlogController from './cms/blog/BlogController'
import BlogRepository from './cms/blog/BlogRepository'
import BlogService from './cms/blog/BlogService'

import EducationController from './cms/education/EducationController'
import EducationRepository from './cms/education/EducationRepository'

import HistoryController from './cms/history/HistoryController'
import HistoryRepository from './cms/history/HistoryRepository'
import HistoryService from './cms/history/HistoryService'

import ProjectController from './cms/project/ProjectController'
import ProjectRepository from './cms/project/ProjectRepository'
import ProjectService from './cms/project/ProjectService'

import type { BlogEntry, EducationEntry, HistoryEntry, ProjectEntry } from './cms/types'

export function getHistoryItem(org: string) {
  return useAsyncData(
    'HistoryItemFetcher',
    () => queryContent<HistoryEntry>(useLocale(), 'history').where({ org }).findOne().then(entry => reactive(new HistoryController(entry))),
  )
}

export function getBlogItem(filename: string) {
  return useAsyncData(
    'BlogItemFetcher',
    () => queryContent<BlogEntry>(useLocale(), 'blog').where({ _id: `content:${useLocale()}:blog:${filename}.md` }).findOne().then(entry => reactive(new BlogController(entry))),
  )
}

export const getHistoryService = (repository: HistoryRepository) => new HistoryService(repository)

export const getProjectService = (repository: ProjectRepository) => new ProjectService(repository)

export const getBlogService = (repository: BlogRepository) => new BlogService(repository)

/* export function getHistory() {
  return useAsyncData(
    'HistoryFetcher',
    () => queryContent<HistoryEntry>(useLocale(), 'history').find().then(data =>
      new HistoryRepository(data.map(entry => reactive(new HistoryController(entry)))),
    ),
  )
} */

/* export function getProject() {
  return useAsyncData(
    'ProjectFetcher',
    () => queryContent<ProjectEntry>(useLocale(), 'project').find().then(data => {
      const instances: ProjectController[] = [];
      data.forEach((entry) => {
        try {
          instances.push(reactive(new ProjectController(entry)))
        }
        catch (e) {
          if (e instanceof ZodError) {
            const validationError = fromZodError(e)
            console.warn(entry._path, validationError.toString())
          }
        }
      })

      return new ProjectRepository(instances)
    }),
  )
}

export function getHistory() {
  return useAsyncData(
    'HistoryFetcher',
    () => queryContent<HistoryEntry>(useLocale(), 'history').find().then((data) => {
      const instances: HistoryController[] = [];
      data.forEach((entry) => {
        try {
          instances.push(reactive(new HistoryController(entry)))
        }
        catch (e) {
          if (e instanceof ZodError) {
            const validationError = fromZodError(e)
            console.warn(entry._path, validationError.toString())
          }
        }
      })
      return new HistoryRepository(instances)
    }),
  )
} */

export function getHistory() {
  return useAsyncData(
    'HistoryFetcher',
    () => queryContent<HistoryEntry>(useLocale(), 'history').find().then(
      data => processArray(data, HistoryController, HistoryRepository),
    ),
  )
}

export function getProject() {
  return useAsyncData(
    'ProjectFetcher',
    () => queryContent<ProjectEntry>(useLocale(), 'project').find().then(
      data => processArray(data, ProjectController, ProjectRepository),
    ),
  )
}

export function getBlog() {
  return useAsyncData(
    'BlogFetcher',
    () => queryContent<BlogEntry>(useLocale(), 'blog').find().then(
      data => processArray(data, BlogController, BlogRepository),
    ),
  )
}

export function getEducation() {
  return useAsyncData(
    'EducationFetcher',
    () => queryContent<EducationEntry>(useLocale(), 'education').find().then(
      data => processArray(data, EducationController, EducationRepository),
    ),
  )
}

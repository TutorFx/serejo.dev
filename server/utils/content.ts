import type { H3Event } from 'h3'
import type { EducationEntry, HistoryEntry, ProjectEntry } from '~/utils/cms/types'

import { serverQueryContent } from '#content/server'
import { processArray } from '@/utils/helpers'
import HistoryController from '~/utils/cms/history/HistoryController'
import HistoryRepository from '~/utils/cms/history/HistoryRepository'
import ProjectController from '~/utils/cms/project/ProjectController'
import ProjectRepository from '~/utils/cms/project/ProjectRepository'
import EducationController from '~/utils/cms/education/EducationController'
import EducationRepository from '~/utils/cms/education/EducationRepository'

export async function queryProcessedContent(event: H3Event, lang: string = 'en') {
  const content = await serverQueryContent(event, lang).find()

  const historyEntries = content.filter(i => i._path?.includes('history')) as HistoryEntry[]
  const history = processArray(historyEntries, HistoryController, HistoryRepository, false) as HistoryRepository

  const educationEntries = content.filter(i => i._path?.includes('education')) as EducationEntry[]
  const education = processArray(educationEntries, EducationController, EducationRepository, false) as EducationRepository

  const projectEntries = content.filter(i => i._path?.includes('projects')) as ProjectEntry[]
  const project = processArray(projectEntries, ProjectController, ProjectRepository, false) as ProjectRepository

  return { history, project, education }
}

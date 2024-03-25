import HistoryController from './cms/history/HistoryController'
import HistoryRepository from './cms/history/HistoryRepository'
import HistoryService from './cms/history/HistoryService'

import type { HistoryEntry } from './cms/types'

export function getHistory() {
  const { locale } = useI18n()
  const localeFixed = (locale.value.split('-').at(0) ?? locale.value).toLowerCase()

  return useAsyncData(
    'HistoryFetcher',
    () => queryContent<HistoryEntry>(localeFixed, 'history').find().then(data =>
      new HistoryRepository(data.map(entry => reactive(new HistoryController(entry)))),
    ),
  )
}

export function getHistoryItem(org: string) {
  const { locale } = useI18n()
  const localeFixed = (locale.value.split('-').at(0) ?? locale.value).toLowerCase()

  return useAsyncData(
    'HistoryItemFetcher',
    () => queryContent<HistoryEntry>(localeFixed, 'history').where({ org }).findOne().then(entry => reactive(new HistoryController(entry))),
  )
}

export const getHistoryService = (repository: HistoryRepository) => new HistoryService(repository)

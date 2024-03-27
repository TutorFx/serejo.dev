import HistoryController from '~/utils/cms/history/HistoryController'
import HistoryRepository from '~/utils/cms/history/HistoryRepository'
import ProjectController from '~/utils/cms/project/ProjectController'
import ProjectRepository from '~/utils/cms/project/ProjectRepository'

// payload.js

export default definePayloadPlugin(() => {
  definePayloadReducer('HistoryRepository', (data) => {
    if (data instanceof HistoryRepository)
      return data.getRepository().map(item => item.toObject())
  })

  definePayloadReviver('HistoryRepository', (data) => {
    if (Array.isArray(data)) {
      return new HistoryRepository(
        data.map(item => new HistoryController(item)),
      )
    }
  })

  definePayloadReducer('HistoryController', (data) => {
    if (data instanceof HistoryController)
      return data.toObject()
  })

  definePayloadReviver('HistoryController', (data) => {
    if (typeof data === 'object')
      return new HistoryController(data)
  })

  definePayloadReducer('ProjectRepository', (data) => {
    if (data instanceof ProjectRepository)
      return data.getRepository().map(item => item.toObject())
  })
  definePayloadReviver('ProjectRepository', (data) => {
    if (Array.isArray(data)) {
      return new ProjectRepository(
        data.map(item => new ProjectController(item)),
      )
    }
  })

  definePayloadReducer('ProjectController', (data) => {
    if (data instanceof ProjectController)
      return data.toObject()
  })
  definePayloadReviver('ProjectController', (data) => {
    if (typeof data === 'object')
      return new ProjectController(data)
  })
})

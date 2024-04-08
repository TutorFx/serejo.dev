import BlogController from '~/utils/cms/blog/BlogController'
import BlogRepository from '~/utils/cms/blog/BlogRepository'
import HistoryController from '~/utils/cms/history/HistoryController'
import HistoryRepository from '~/utils/cms/history/HistoryRepository'
import ProjectController from '~/utils/cms/project/ProjectController'
import ProjectRepository from '~/utils/cms/project/ProjectRepository'
import FlagsController from '~/utils/flags/FlagsController'
import FlagsRepository from '~/utils/flags/FlagsRepository'

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

  definePayloadReducer('BlogRepository', (data) => {
    if (data instanceof BlogRepository)
      return data.getRepository().map(item => item.toObject())
  })
  definePayloadReviver('BlogRepository', (data) => {
    if (Array.isArray(data)) {
      return new BlogRepository(
        data.map(item => new BlogController(item)),
      )
    }
  })

  definePayloadReducer('BlogController', (data) => {
    if (data instanceof BlogController)
      return data.toObject()
  })
  definePayloadReviver('BlogController', (data) => {
    if (typeof data === 'object')
      return new BlogController(data)
  })

  definePayloadReducer('FlagsRepository', (data) => {
    if (data instanceof FlagsRepository)
      return data.flagsRepository.map(item => item.toObject())
  })
  definePayloadReviver('FlagsRepository', (data) => {
    if (Array.isArray(data)) {
      return new FlagsRepository(
        data.map(item => new FlagsController(item.name, item.active, item.defaultvalue)),
      )
    }
  })

  definePayloadReducer('FlagsController', (data) => {
    if (data instanceof FlagsController)
      return data.toObject()
  })
  definePayloadReviver('FlagsController', (data) => {
    if (typeof data === 'object')
      return new FlagsController(data.name, data.active, data.defaultvalue)
  })
})

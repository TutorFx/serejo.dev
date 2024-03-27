import type HistoryController from './HistoryController'

export default class {
  item: HistoryController

  constructor(item: HistoryController) {
    this.item = item
  }

  getItem() {
    return this.item
  }
}

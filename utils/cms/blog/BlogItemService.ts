import type BlogController from '~/utils/cms/blog/BlogController'

export default class {
  item: BlogController

  constructor(item: BlogController) {
    this.item = item
  }

  getItem() {
    return this.item
  }
}

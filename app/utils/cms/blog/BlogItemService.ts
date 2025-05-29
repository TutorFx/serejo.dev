import type BlogController from "./BlogController"

export default class {
  item: BlogController

  constructor(item: BlogController) {
    this.item = item
  }

  getItem() {
    return this.item
  }
}

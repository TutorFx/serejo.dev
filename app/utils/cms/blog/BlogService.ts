import type BlogRepository from './BlogRepository'

export default class {
  blog: BlogRepository

  constructor(blogRepository: BlogRepository) {
    this.blog = blogRepository
  }
}

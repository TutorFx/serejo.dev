export interface ExperienceDto {
  title: string
  org: string
  image: string
  start: string
  end: string
  location: string
  locale: LocaleKey
  readingTimeInSeconds: number
  readingTimeString: string
  reducedBody: string | undefined
  path: string
  body: object
}

export type ExperiencesDto = Omit<ExperienceDto, 'body'> & { body: object | null }

export interface BlogPostDto {
  title: string
  locale: LocaleKey
  readingTimeInSeconds: number
  readingTimeString: string
  reducedBody: string | undefined
  path: string
  slug: string | null
  body: object
}

export type BlogPostsDto = Omit<BlogPostDto, 'body'>

export interface EducationDto {
  title: string
  org: string
  start: string
  end: string
  date: string
  path: string
  locale: LocaleKey
  body: object
}

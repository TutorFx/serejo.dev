export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, data => educationQuerySchema.safeParse(data))
  const t = await useTranslation(event)

  if (!query.data) {
    return createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid input',
      data: query.error.issues,
    })
  }

  const experiences = await queryCollection(event, 'education').where('id', 'LIKE', `%/${query.data.lang || LOCALE_KEYS.EN_US}/%`).order('end', 'ASC').all()

  return experiences?.map((item) => {
    const { data } = educationWithBodySchema.safeParse(item)

    if (!data)
      return null

    const { title, start, end, meta, org, stem, body } = data
    const { locale } = meta
    const path = processCmsPath(locale, stem)

    return {
      title,
      org,
      start: formatCardDate(start, locale),
      end: end ? formatCardDate(end, locale) : t('time.the_moment'),
      locale,
      path,
      body,
      date: end ? t('curriculum.graduated_in', { date: formatCardDate(start, locale) }) : t('curriculum.in_progress'),
    }
  }).filter(item => item !== null) satisfies EducationDto[] ?? []
})

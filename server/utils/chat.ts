import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import enUS from '~~/i18n/locales/en-US'
import { educationSchema, historySchema } from '~~/shared/utils/cms/cms.schemas'

export async function getResumeContext(event?: H3Event): Promise<string> {
  const enLocale = await enUS('en-US')
  const curriculum = enLocale.curriculum

  let experiencesText = ''
  let educationText = ''

  try {
    const historyDocs = await queryCollection(event as H3Event, 'history')
      .where('id', 'LIKE', '%/en-US/%')
      .order('start', 'DESC')
      .all()

    const formattedExp = historyDocs
      .map((doc) => {
        const parsed = historySchema.safeParse(doc)
        if (!parsed.success) {
          return null
        }
        const { title, org, start, end, location } = parsed.data
        const startYear = start ? new Date(start).getFullYear() : ''
        const endYear = end ? new Date(end).getFullYear() : 'Present'
        const isCurrent = !end
        return `- ${title} at ${org} (${startYear} - ${endYear}, ${location}) ${isCurrent ? '[CURRENT ROLE / ACTIVE]' : '[PAST ROLE]'}`
      })
      .filter(Boolean)

    experiencesText = formattedExp.join('\n')
  } catch {
    // Fallback if queryCollection is unavailable
  }

  try {
    const educationDocs = await queryCollection(event as H3Event, 'education')
      .where('id', 'LIKE', '%/en-US/%')
      .order('end', 'DESC')
      .all()

    const formattedEdu = educationDocs
      .map((doc) => {
        const parsed = educationSchema.safeParse(doc)
        if (!parsed.success) {
          return null
        }
        const { title, org, start, end } = parsed.data
        const startYear = start ? new Date(start).getFullYear() : ''
        const endYear = end ? new Date(end).getFullYear() : 'Present'
        return `- ${title} — ${org} (${startYear} - ${endYear})`
      })
      .filter(Boolean)

    educationText = formattedEdu.join('\n')
  } catch {
    // Fallback
  }

  const skillsList = Array.isArray(curriculum.skills) ? curriculum.skills.join(', ') : ''
  const certsList = Array.isArray(curriculum.certifications) ? curriculum.certifications.join(', ') : ''

  return `
**Candidate Resume & Profile Summary (Source of Truth):**
- **Profession / Primary Title**: ${curriculum.profession || 'Generative AI Engineer'}
${experiencesText ? `- **Work Experience & Timeline**:\n${experiencesText}` : ''}
${educationText ? `- **Education**:\n${educationText}` : ''}
${skillsList ? `- **Key Technical Proficiencies**: ${skillsList}` : ''}
${certsList ? `- **Certifications**: ${certsList}` : ''}
`.trim()
}

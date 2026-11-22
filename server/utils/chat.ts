import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import enUS from '~~/i18n/locales/en-US'

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

    const formattedExp = historyDocs.map(({ title, org, start, end, location }) => {
      const startYear = new Date(start).getFullYear()
      const endYear = end ? new Date(end).getFullYear() : 'Present'
      // The CV gives the current role its planned end date; it stays current until that date
      const isCurrent = !end || new Date(end) > new Date()
      return `- ${title} at ${org} (${startYear} - ${endYear}, ${location}) ${isCurrent ? '[CURRENT ROLE / ACTIVE]' : '[PAST ROLE]'}`
    })

    experiencesText = formattedExp.join('\n')
  } catch {
    // Fallback if queryCollection is unavailable
  }

  try {
    const educationDocs = await queryCollection(event as H3Event, 'education')
      .where('id', 'LIKE', '%/en-US/%')
      .order('end', 'DESC')
      .all()

    const formattedEdu = educationDocs.map(({ title, org, start, end }) => {
      const startYear = new Date(start).getFullYear()
      const endYear = end ? new Date(end).getFullYear() : 'Present'
      return `- ${title} — ${org} (${startYear} - ${endYear})`
    })

    educationText = formattedEdu.join('\n')
  } catch {
    // Fallback
  }

  // The texts of the CV keep the literal interpolations vue-i18n needs (such as {'@'}); the prompt gets the plain character
  const plain = (text: string) => text.replace(/\{'([^']*)'\}/g, '$1')
  const skillsList = Array.isArray(curriculum.skills)
    ? curriculum.skills.map(group => `${plain(group.title)}: ${plain(group.items)}`).join('; ')
    : ''
  const certsList = Array.isArray(curriculum.certifications)
    ? curriculum.certifications.map(cert => plain(cert)).join(', ')
    : ''

  return `
**Candidate Resume & Profile Summary (Source of Truth):**
- **Profession / Primary Title**: ${plain(curriculum.profession || 'Generative AI Engineer')}
${experiencesText ? `- **Work Experience & Timeline**:\n${experiencesText}` : ''}
${educationText ? `- **Education**:\n${educationText}` : ''}
${skillsList ? `- **Key Technical Proficiencies**: ${skillsList}` : ''}
${certsList ? `- **Certifications**: ${certsList}` : ''}
`.trim()
}

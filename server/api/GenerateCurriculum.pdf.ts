import { PassThrough } from 'node:stream'
import PDFDocument from 'pdfkit'

export default defineEventHandler(async (event) => {
  const lang = tryCookieLocale(event, { lang: '', name: 'i18n_redirected' })?.language

  const fileData = await $fetch<Blob>(`https://raw.githubusercontent.com/google/fonts/main/ofl/spacegrotesk/SpaceGrotesk%5Bwght%5D.ttf`)

  const t = await useTranslation(event)
  const me = 'Gabriel Serejo'
  const birth = new Date('08-12-1997')
  const yearsOld = (new Date().getFullYear() - birth.getFullYear()) - 1

  const config = useRuntimeConfig()

  // Create a PassThrough stream to capture the PDF data
  const pdfStream = new PassThrough()

  const doc = new PDFDocument({ size: 'A4', margin: 20 })

  const fontname = 'spacegrotesk'

  doc.registerFont(fontname, await fileData.arrayBuffer())

  const { history, education } = await queryProcessedContent(event, lang)

  doc.pipe(pdfStream)

  doc.font(fontname).fontSize(16).text(me, {
    align: 'center',
    paragraphGap: 32,
  })

  doc.font(fontname).fontSize(12).text(t('me.live_in'), {
    paragraphGap: 5,
  })

  doc.font(fontname).fontSize(12).text(t('me.years_old', { years: yearsOld }), {
    paragraphGap: 5,
  })

  doc.font(fontname).fontSize(12).text('gabrieltfserejo@gmail.com', {
    paragraphGap: 5,
  })

  doc.font(fontname).fontSize(12).text(config.public.phoneNumber, {
    paragraphGap: 10,
  })

  doc.font(fontname).fontSize(16).text(t('curriculum.summary'), {
    paragraphGap: 20,
  })

  doc.font(fontname).fontSize(12).text(t('me.summary'), {
    paragraphGap: 20,
  })

  doc.font(fontname).fontSize(16).text(t('curriculum.work_experience'), {
    paragraphGap: 20,
  })

  history.getSortedRepository().forEach((element) => {
    doc.font(fontname).fontSize(18).text(element.org, {
      paragraphGap: 5,
    })
    doc.font(fontname).fontSize(12).text(`${element.title} - ${element.location} (${element.getDateToLocaleString(lang).join(` ${t('time.until_the')} `)})`, {
      paragraphGap: 5,
    })
    doc.font(fontname).fontSize(12).text(element.getSafeTruncatedDescription(30000).replace(/(\r\n|\n|\r)/gm, ''), {
      paragraphGap: 30,
    })
  })

  doc.font(fontname).fontSize(16).text(t('curriculum.education'), {
    paragraphGap: 20,
  })

  education.getSortedRepository().forEach((element) => {
    doc.font(fontname).fontSize(18).text(element.org, {
      paragraphGap: 5,
    })
    doc.font(fontname).fontSize(12).text(`${element.title} (${element.getDateToLocaleString(lang).join(` ${t('time.until_the')} `)})`, {
      paragraphGap: 5,
    })
    doc.font(fontname).fontSize(12).text(element.getSafeTruncatedDescription(30000).replace(/(\r\n|\n|\r)/gm, ' '), {
      paragraphGap: 30,
    })
  })

  doc.end()

  // Return the PDF data as a stream
  return await sendStream(event, pdfStream)
})

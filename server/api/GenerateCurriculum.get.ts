import { PassThrough } from 'node:stream'
import PDFDocument from 'pdfkit'

export default defineEventHandler(async (event) => {
    const t = await useTranslation(event);
    const lang = 'en';
    const me = 'Gabriel Serejo'

    const config = useRuntimeConfig()

    // Create a PassThrough stream to capture the PDF data
    const pdfStream = new PassThrough();

    const doc = new PDFDocument({ size: 'A4', margin: 20 });

    let pageNumber = 0;

    doc.on('pageAdded',
        () => {
            // Don't forget the reset the font family, size & color if needed
            doc.fontSize(14).text(String(++pageNumber + 1), 0.5 * (doc.page.width - 100), 40, { width: 100, align: 'center' });
        }
    );

  const { history } = await queryProcessedContent(event, lang)
    const { history } = await queryProcessedContent(event, lang);

    doc.pipe(pdfStream);

    doc.fontSize(16).text(me, {
        align: 'center',
        paragraphGap: 32
    });

    doc.fontSize(16).text(t('curriculum.summary'), {
        paragraphGap: 20
    });

    doc.fontSize(12).text(t('me.summary'), {
        paragraphGap: 20
    });

    doc.fontSize(12).text('gabrieltfserejo@gmail.com', {
        paragraphGap: 5
    });

    doc.fontSize(12).text(config.public.phoneNumber, {
        paragraphGap: 10
    });

    doc.fontSize(16).text(t('curriculum.work_experience'), {
        paragraphGap: 20
    });

    history.getSortedRepository().forEach(element => {
        doc.fontSize(16).text(element.org);
        doc.fontSize(12).text(`${element.title} - ${element.location} (${element.getDateToLocaleString(lang).join(` ${t('time.until_the')} `)})`);
        doc.fontSize(12).text(element.getBodyAsPlain(), {
            paragraphGap: 30
        });
    });

    doc.end();

    // Return the PDF data as a stream
    return await sendStream(event, pdfStream);
})

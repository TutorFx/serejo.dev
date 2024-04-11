import { createWriteStream, promises } from 'node:fs';
import PDFDocument from 'pdfkit';

export default defineEventHandler(async (event) => {
    const t = await useTranslation(event)

    const lang = 'en'

    const doc = new PDFDocument({
        size: 'A4',
        margin: 20
    });

    const outputFilePath = '.nuxt/output.pdf'; // Define the output file path

    const writeStream = createWriteStream(outputFilePath); // Create a write stream

    const { history } = await queryProcessedContent(event, lang)

    doc.pipe(writeStream); // Pipe the PDF document to the write stream

    doc.fontSize(16).text('Gabriel Serejo', {
        align: 'center',
        paragraphGap: 32
    });

    history.getSortedRepository().forEach(element => {
        doc.fontSize(16).text(element.org);
        doc.fontSize(12).text(`${element.title} - ${element.location} (${element.getDateToLocaleString(lang).join(` ${t('time.until_the')} `)})`);
        doc.fontSize(12).text(element.getBodyAsPlain(), {
            paragraphGap: 24
        });
    });


    doc.end(); // Finalize the PDF document

    // Wait for the write stream to finish and then read the file
    await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });

    const pdfData = await promises.readFile(outputFilePath);

    return pdfData; // Return the PDF data as the response
})

import { PDFDocument } from 'pdf-lib'
import * as fs from 'node:fs/promises';

// These should be Uint8Arrays or ArrayBuffers
// This data can be obtained in a number of different ways
// If your running in a Node environment, you could use fs.readFile()
// In the browser, you could make a fetch() call and use res.arrayBuffer()
async function run() {
    const formPdfBytes = await fs.readFile('c:\\Users\\azimb\\Downloads\\Adult Name Change Petition - Non-Felon (3).pdf')

    // Load a PDF with form fields
    const pdfDoc = await PDFDocument.load(formPdfBytes)



    // Get the form containing all the fields
    const form = pdfDoc.getForm()

    form.getFields().forEach(field => {
        const type = field.constructor.name;
        const name = field.getName();
        console.log(`${type}: ${name}`);
    })

    // console.log(form)
}

run()
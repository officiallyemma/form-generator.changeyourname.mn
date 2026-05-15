
import { PDFDocument } from 'pdf-lib';
// import.meta.glob('./plugins/**/*.js')

async function load() {

    let path = window.location.pathname.split('/').slice(-1)[0] || 'minnesota'
    return await import(`./imports/${path}.ts`)
}

document.addEventListener('DOMContentLoaded', async () => {
    let Config = (await load()).default;
    document.fonts.ready.then(async () => {
        // wait for md custom elements to be defined before we render form elements
        await customElements.whenDefined('md-outlined-select');
        await customElements.whenDefined('md-outlined-text-field');
        Config.form.forEach(async section => {
            if (section.type === 'comment') {
                document.querySelector('#materialForm').insertAdjacentHTML('beforeend', section.html);
                return;
            }

            // render form sections
            let html = `
                <div class="card guide-section">
                    <div class="section-header">
                        <span class="material-symbols-outlined section-icon">${section.headerIcon}</span>
                        <h2>${section.headerText}</h2>
                    </div>
                    <div class="section-content">
                        <div class="form-grid">
            ${section.fields.map(field => {
                return field.type === 'select' ?
                    `<md-outlined-select id="${field.id}" label="${field.label}" supporting-text="${field.supportingText}" autocomplete="off" serialize>
                        <md-select-option aria-label="blank"></md-select-option> 
                            ${field.options.map(option => `<md-select-option value="${option.value}">${option.label}
                        </md-select-option>`).join('')}
                    </md-outlined-select>`
                    : `<md-outlined-text-field id="${field.id}" label="${field.label}" type="${field.type}" supporting-text="${field.supportingText}" autocomplete="off" serialize></md-outlined-text-field>`
            }).join('')}
                        </div>
                    </div>
                </div>  
            `
            document.querySelector('#materialForm').insertAdjacentHTML('beforeend', html);
        });


        // patch ios rendering bug
        if (isMobile()) {
            document.querySelectorAll('md-outlined-text-field[type="date"]').forEach((element, index) => {
                (element as HTMLInputElement).value = '1999-01-01';
            });
        }

        async function getCounter() {
            let counterValue = await (await fetch("/counter")).text();
            return counterValue?.length >= 100 ? NaN : counterValue ?? NaN;
        }

        // render document buttons
        document.querySelector('#materialForm').insertAdjacentHTML('beforeend', `
            <div class="card guide-section">
                <div class="section-header">
                    <span class="material-symbols-outlined section-icon">download</span>
                    <h2>Securely Generate Your Forms</h2>
                </div>
                <div class="section-content">
                    <div class="sub-card sub-card--highlight">
                        <p>
                            Click each button below to sign and download your completed forms.
                            Make sure all information above is correct before proceeding.
                        </p>
                    </div>
                </div>
                <div class="button-group">
            ${Config.documents.map(doc => `
                    <md-filled-button class="submit" id="submit-${doc.name}" value="" has-icon="">
                        <span class="material-symbols-outlined" slot="icon">${doc.btnIcon}</span>
                        ${doc.btnText}
                    </md-filled-button>
            `).join('')}
                </div>
                <div class="sub-card counter-card">
                        <p>${await getCounter()} forms generated since 2025</p>
                    </div>

            </div>
        `);


        Config.documents.forEach(doc => {
            document.getElementById(`submit-${doc.name}`).addEventListener('click', async () => {
                const data: { [key: string]: any } = {};

                document.querySelectorAll(`#materialForm [serialize]`).forEach((input: HTMLInputElement) => {
                    data[input.id] = input.value;
                });

                let pdfFields = doc.build(data);

                // Fetch the PDF with form fields
                // TODO: do this on page load so user can turn on airplane mode while generating PDFs as a form of security theatre /shrug
                const formUrl = `${doc.path}${doc.name}`;
                const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());

                // Load a PDF with form fields
                const pdfDoc = await PDFDocument.load(formPdfBytes);

                // Get the form containing all the fields
                const form = pdfDoc.getForm();

                try {
                    Object.keys(doc.pdfFields).forEach(key => {
                        if (doc.pdfFields[key] === 'text') {
                            form.getTextField(key).setText(pdfFields[key] || '');
                        } else if (doc.pdfFields[key] === 'checkbox') {
                            if (pdfFields[key]) {
                                form.getCheckBox(key).check();
                            } else {
                                form.getCheckBox(key).uncheck();
                            }

                        }
                    })

                    // pass  object to Config for additional custom PDF manipulation
                    Config.onGenerate(pdfDoc);

                } catch (e) {
                    console.error(`Error filling PDF form: ${e}`);
                    alert('An error occurred while generating the PDF form. Sorry! Please try again later or email me (emma@zimbin.ski) if the problem persists.');
                    return;
                }

                if (!Config.demo) {
                    fetch('/increment', { method: 'POST' }).catch(err => {
                        console.error('Failed to increment counter:', err);
                    });
                }

                // Serialize the PDFDocument to bytes (a Uint8Array)
                const pdfBytes = await pdfDoc.save();

                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(blob);
                var a = document.createElement("a");
                a.href = fileURL;
                a.download = `${doc.name}`;
                a.click();

                if (window.innerWidth > 768) {
                    window.open(fileURL, '_blank');
                }
            });
        })

        // call manifest for additional onload behavior
        Config.onload();

        document.body.classList.remove('loading');
    });
});


function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent) || window.matchMedia("(max-width: 768px)").matches;
}
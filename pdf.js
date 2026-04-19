import '@material/web/button/filled-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import '@material/web/iconbutton/icon-button.js';
import { PDFDocument } from 'pdf-lib';
import Config from './FormGeneratorConfig';
// generate form from config
//  <div class="card guide-section" id="current-identity">
//                 <div class="section-header">
//                     <span class="material-symbols-outlined section-icon">person</span>
//                     <h2>1. Current Legal Name</h2>
//                 </div>
//                 <div class="section-content">
//                     <div class="form-grid">
//                         <md-outlined-text-field id="currentFirstName" label="Current Legal First Name"
//                             supporting-text="As shown on official documents"></md-outlined-text-field>
//                         <md-outlined-text-field id="currentMiddleName" label="Current Legal Middle Name"
//                             supporting-text="Leave blank if none"></md-outlined-text-field>
//                         <md-outlined-text-field id="currentLastName" label="Current Legal Last Name"
//                             supporting-text="As shown on official documents"></md-outlined-text-field>
//                         <md-outlined-text-field id="dateOfBirth" label="Date of Birth"
//                             type="date"></md-outlined-text-field>
//                         <md-outlined-text-field id="race" label="Race" type="text"
//                             supporting-text="Race for NAM103"></md-outlined-text-field>
//                     </div>
//                 </div>
//             </div>
document.addEventListener('DOMContentLoaded', () => {
    document.fonts.ready.then(async () => {
        // wait for md custom elements to be defined before we render form elements
        await customElements.whenDefined('md-outlined-select');
        await customElements.whenDefined('md-outlined-text-field');
        Config.form.forEach(async (section) => {
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
                                            ${field.options.map(option => `<md-select-option value="${option.value}">${option.label}</md-select-option>`).join('')}
                                        </md-outlined-select>` :
                    `<md-outlined-text-field id="${field.id}" label="${field.label}" type="${field.type}" supporting-text="${field.supportingText}" autocomplete="off" serialize></md-outlined-text-field>`;
            }).join('')}
                        </div>
                    </div>
                </div>  
            `;
            document.querySelector('#materialForm').insertAdjacentHTML('beforeend', html);
        });
        // patch ios rendering bug
        if (isMobile()) {
            document.querySelectorAll('md-outlined-text-field[type="date"]').forEach((element, index) => {
                element.value = '1999-01-01';
            });
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
                        <p>${await (await fetch("/counter")).text() ?? NaN} forms generated since 2025</p>
                    </div>

            </div>
        `);
        Config.documents.forEach(doc => {
            document.getElementById(`submit-${doc.name}`).addEventListener('click', async () => {
                const data = {};
                document.querySelectorAll(`#materialForm [serialize]`).forEach((input) => {
                    data[input.id] = input.value;
                });
                let pdfFields = doc.build(data);
                // Fetch the PDF with form fields
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
                        }
                        else if (doc.pdfFields[key] === 'checkbox') {
                            if (pdfFields[key]) {
                                form.getCheckBox(key).check();
                            }
                            else {
                                form.getCheckBox(key).uncheck();
                            }
                        }
                    });
                    // pass form object to Config for additional custom PDF manipulation
                    Config.onGenerate(form);
                }
                catch (e) {
                    console.error(`Error filling PDF form: ${e}`);
                    alert('An error occurred while filling the PDF form. Most likely a "me problem" not a "you problem". Sorry! Please try again later or email me if the problem persists.');
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
        });
        // call manifest for additional onload behavior
        Config.onload();
        document.body.classList.remove('loading');
    });
});
function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent) || window.matchMedia("(max-width: 768px)").matches;
}

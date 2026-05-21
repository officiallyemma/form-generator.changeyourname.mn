import { PDFDocument, PDFForm, rgb, degrees } from "pdf-lib";
import type { FormGeneratorConfig } from "../Config"
import { count } from "node:console";

function formatDate(date) {
    // turn "YYYY-MM-DD" into "MM-DD-YYYY"
    if (typeof date === 'string') {
        var parts = date.split('-');
        if (parts.length === 3) {
            return [parts[1], parts[2], parts[0]].join('-');
        } else {
            return date;
        }
    }

    // otherwise assume it's a Date object
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [month, day, year].join('-');
}


let Config: FormGeneratorConfig = {
    name: "co-form-generator",
    demo: true,
    version: "0.0.0",
    form: [
        {
            type: "comment",
            html: `
            <div class="card header-card">
                <img src="banner.webp" height="100" alt="Name Change Form Generator" />
                <h1>Colorado Trans Name Change Court Document Generator</h1>
                <p class="body-text">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                </p>


                <div class="sub-card sub-card--info" style="padding: 10px;">
                    <p>
                    <strong>Security Notice:</strong>
                    Everything runs locally in your browser, meaning your data doesn't get sent anywhere. This app is
                    <a href="https://github.com/officiallyemma/form-generator.changeyourname.mn" target="_blank" rel="noopener">open source</a>.
                    </p>
                </div>

                <div class="sub-card sub-card--info">
                    <p>
                    <strong>Prefer to fill out the forms manually?</strong>
                    Try out these interactive PDFs (doesn't work on iOS)
                    <br><br>
                    <md-outlined-button onclick="window.open('/ColoradoTest.pdf', '_blank')">
                        <span class="material-symbols-outlined" slot="icon">download</span>
                        Download Interactive Packet
                    </md-outlined-button>
                    </p>

                    <p>Otherwise, continue to the form below to generate pre-filled PDFs that you can sign and submit to the court.</p>

                </div>
            </div>
`,
        },
        {
            headerText: "1. Current Legal Name",
            headerIcon: "person",
            fields: [
                {
                    id: "currentFirstName",
                    label: "Current Legal First Name",
                    supportingText: "As shown on official documents",
                    type: "text",
                },
                {
                    id: "currentMiddleName",
                    label: "Current Legal Middle Name",
                    supportingText: "Leave blank if none",
                    type: "text",
                },
                {
                    id: "currentLastName",
                    label: "Current Legal Last Name",
                    supportingText: "As shown on official documents",
                    type: "text",
                },
                {
                    id: "dateOfBirth",
                    label: "Date of Birth",
                    type: "date",
                    supportingText: "",
                }
            ],
        },
        {
            headerText: "2. New Legal Name",
            headerIcon: "badge",
            fields: [
                {
                    id: "newFirstName",
                    label: "New First Name",
                    supportingText: "Your chosen first name",
                    type: "text",
                },
                {
                    id: "newMiddleName",
                    label: "New Middle Name",
                    supportingText: "Leave blank if none",
                    type: "text",
                },
                {
                    id: "newLastName",
                    label: "New Last Name",
                    supportingText: "Your chosen last name",
                    type: "text",
                },
            ],
        },
        {
            headerText: "4. Contact Information",
            headerIcon: "contact_mail",
            fields: [
                {
                    id: "address",
                    label: "Street Address",
                    supportingText: "Include apartment/unit number",
                    type: "text",
                },
                {
                    id: "city",
                    label: "City",
                    type: "text",
                    value: "",
                    supportingText: "",
                },
                {
                    id: "state",
                    label: "State",
                    type: "text",
                    value: "Minnesota",
                    supportingText: "",
                },
                {
                    id: "zip",
                    label: "ZIP Code",
                    type: "text",
                    value: "",
                    supportingText: "",
                },
                {
                    id: "county",
                    label: "County",
                    supportingText: "e.g. El Paso, Denver, Arapahoe County",
                    type: "text",
                },
                {
                    id: "phone",
                    label: "Phone Number",
                    supportingText: "Include area code",
                    type: "tel",
                },
                {
                    id: "email",
                    label: "Email Address",
                    supportingText: "Court will use this for updates",
                    type: "email",
                },
            ],
        },
        {
            type: "comment",
            html: `
                
                    <div class="card sub-card sub-card--info">
                        <h2>Blah Blah Blah explanation of why the court asks for a reason. "im trans and need a name that's fitting and proper" and that this allows you to add a reason</h2>
                        <p>
                        </p>
                    </div>
                    `
        },
        {
            headerText: "5. (Optional) Short Narrative Statement",
            headerIcon: "text_snippet",
            fields: [
                {
                    id: "narrative",
                    label: "Name Change Reason",
                    supportingText: "Why are you changing your name? (1-2 sentences is sufficient)",
                    type: "text",
                }
            ]
        },
        {
            type: "comment",
            html: `

                <div class="card">
                    <div class="sub-card sub-card--warning">
                        <h2>Insert Disclaimer Text Here Lorem Ipsum Don't Sue Me</h2>
                        <p>
                            <strong>Important Disclaimer:</strong>
                            <u>You</u> are responsible for checking the validity of the information in these forms prior to submitting to the courts.
                            Always double-check your forms and consult with a lawyer if you have any questions or concerns.
                        </p>
                        <p>
                            By using this tool, you agree that the creator of this website is not liable for any consequences arising from your use of the generated documents.
                        </p>

                    </div>
                </div>
        `,
        },
    ],
    documents: [
        {
            path: "/",
            name: "ColoradoTest.pdf",
            btnText: "Download SAMPLE PDF FOR DEMO PURPOSES ONLY",
            btnIcon: "description",
            inputFields: [
                "currentFirstName",
                "currentMiddleName",
                "currentLastName",
                "address",
                "city",
                "state",
                "zip",
                "county",
                "dateOfBirth",
                "newFirstName",
                "newMiddleName",
                "newLastName",
                "phone",
                "email",
            ],
            pdfFields: {
                old_full_name_1: "text",
                old_full_name_2: "text",
                old_full_name_3: "text",
                old_full_name_4: "text",
                old_full_name_5: "text",
                old_full_name_6: "text",
                old_full_name_7: "text",
                old_full_name_8: "text",
                old_full_name_9: "text",
                old_full_name_10: "text",
                new_full_name_1: "text",
                new_full_name_2: "text",
                new_full_name_3: "text",
                new_full_name_4: "text",
                new_full_name_5: "text",
                new_full_name_6: "text",
                new_full_name_7: "text",
                new_full_name_8: "text",
                county_1: "text",
                county_2: "text",
                county_3: "text",
                county_4: "text",
                county_5: "text",
                dob_1: "text",
                dob_2: "text",
                narrative: "text",
            },
            build: (data) => {
                let old_full_name = `${data.currentFirstName} ${data.currentMiddleName} ${data.currentLastName}`;
                let new_full_name = `${data.newFirstName} ${data.newMiddleName} ${data.newLastName}`;
                return {
                    old_full_name_1: old_full_name,
                    old_full_name_2: old_full_name,
                    old_full_name_3: old_full_name,
                    old_full_name_4: old_full_name,
                    old_full_name_5: old_full_name,
                    old_full_name_6: old_full_name,
                    old_full_name_7: old_full_name,
                    old_full_name_8: old_full_name,
                    new_full_name_1: new_full_name,
                    new_full_name_2: new_full_name,
                    new_full_name_3: new_full_name,
                    new_full_name_4: new_full_name,
                    new_full_name_5: new_full_name,
                    new_full_name_6: new_full_name,
                    new_full_name_7: new_full_name,
                    new_full_name_8: new_full_name,
                    county_1: data.county,
                    county_2: data.county,
                    county_3: data.county,
                    county_4: data.county,
                    county_5: data.county,
                    dob_1: formatDate(data.dateOfBirth),
                    dob_2: formatDate(data.dateOfBirth),
                    narrative: data.narrative,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                };
            },
        }
    ],
    onload: () => {
        (document.querySelector('#state') as HTMLInputElement).value = "Colorado";
        (document.querySelector('#narrative') as HTMLInputElement).value = "I am transgender and need a name that is fitting and proper.";
    },
    onGenerate: (pdf: PDFDocument) => {
        const pages = pdf.getPages()
        pages.forEach(page => {
            const { width, height } = page.getSize()
            page.drawText('DEMO DEMO DEMO DEMO DEMO', {
                x: 5,
                y: height / 2 + 300,
                size: 50,
                color: rgb(0.5, 0.1, 0.1),
                rotate: degrees(-45),
            })


        })
    },
};

export default Config
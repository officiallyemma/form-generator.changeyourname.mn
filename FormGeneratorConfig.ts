import { PDFDocument, PDFForm } from "pdf-lib";
import type { FormGeneratorConfig } from "./Config"

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
    name: 'mn-form-generator',
    version: '0.0.0',
    form: [
        {
            "headerText": "1. Current Legal Name",
            "headerIcon": "person",
            "fields": [
                {
                    "id": "currentFirstName",
                    "label": "Current Legal First Name",
                    "supportingText": "As shown on official documents",
                    "type": "text"
                },
                {
                    "id": "currentMiddleName",
                    "label": "Current Legal Middle Name",
                    "supportingText": "Leave blank if none",
                    "type": "text"
                },
                {
                    "id": "currentLastName",
                    "label": "Current Legal Last Name",
                    "supportingText": "As shown on official documents",
                    "type": "text"
                },
                {
                    "id": "dateOfBirth",
                    "label": "Date of Birth",
                    "type": "date",
                    "supportingText": ""
                },
                {
                    "id": "race",
                    "label": "Race",
                    "supportingText": "Race for NAM103",
                    "type": "text"
                }
            ]
        },
        {
            "headerText": "2. New Legal Name",
            "headerIcon": "badge",
            "fields": [
                {
                    "id": "newFirstName",
                    "label": "New First Name",
                    "supportingText": "Your chosen first name",
                    "type": "text"
                },
                {
                    "id": "newMiddleName",
                    "label": "New Middle Name",
                    "supportingText": "Leave blank if none",
                    "type": "text"
                },
                {
                    "id": "newLastName",
                    "label": "New Last Name",
                    "supportingText": "Your chosen last name",
                    "type": "text"
                }
            ]
        },
        {
            "headerText": "3. Sex/Gender Information",
            "headerIcon": "wc",
            "fields": [
                {
                    "id": "sexOnBirthRecords",
                    "label": 'Assigned Sex at Birth',
                    "supportingText": "Your sex as it appears on your birth certificate now",
                    "type": "select",
                    "options": [
                        { "value": "female", "label": "Female" },
                        { "value": "male", "label": "Male" },
                        { "value": "NA", "label": "Not Listed" }
                    ]
                },
                {
                    "id": "newSex",
                    "label": "Amended Sex on Birth Records",
                    "supportingText": "Your sex as you want it on your birth certificate",
                    "type": "select",
                    "options": [
                        { "value": "female", "label": "Female" },
                        { "value": "male", "label": "Male" },
                        { "value": "X", "label": "X" }
                    ]
                }
            ]
        },
        {
            "headerText": "4. Contact Information",
            "headerIcon": "contact_mail",
            "fields": [
                {
                    "id": "address",
                    "label": "Street Address",
                    "supportingText": "Include apartment/unit number",
                    "type": "text"
                },
                {
                    "id": "city",
                    "label": "City",
                    "type": "text",
                    "value": "",
                    "supportingText": ""
                },
                {
                    "id": "state",
                    "label": "State",
                    "type": "text",
                    "value": "Minnesota",
                    "supportingText": ""

                },
                {
                    "id": "zip",
                    "label": "ZIP Code",
                    "type": "text",
                    "value": "",
                    "supportingText": ""
                },
                {
                    "id": "county",
                    "label": "County",
                    "supportingText": "e.g. Hennepin, Ramsey, Dakota",
                    "type": "text"
                },
                {
                    "id": "phone",
                    "label": "Phone Number",
                    "supportingText": "Include area code",
                    "type": "tel"
                },
                {
                    "id": "email",
                    "label": "Email Address",
                    "supportingText": "Court will use this for updates",
                    "type": "email"
                }
            ]
        },
        {
            "type": "comment",
            "html": `

                <div class="card">
                    <div class="sub-card sub-card--warning">
                        <h2>Don't Sue Me</h2>
                        <p>
                            <strong>Important Disclaimer:</strong>
                            <u>You</u> are responsible for checking the validity of the information in these forms prior to submitting to the courts.
                            <b>I am not a lawyer, and the software I wrote definitely isn't one either.</b>
                            This website is just a tool to help you fill out and download the forms, and is not a substitute for legal advice or official resources. 
                            You will need to submit these forms to the government in order to apply for a name change.
                            This tool offers no guarantees that any generated form is accurate, fit for any purpose, or will be accepted by the court.
                            Always double-check your forms and consult with a lawyer if you have any questions or concerns.
                        </p>
                        <p>
                            By using this tool and signing below, you agree that the creator of this website is not liable for any consequences arising from your use of the generated documents.
                        </p>

                    </div>
                </div>
        `
        },
        {
            "headerText": "5. Legal Signature",
            "headerIcon": "signature",
            "fields": [
                {
                    "id": "legallyBindingSignature",
                    "label": "Legally Binding Signature",
                    "supportingText": "This may be your new legal name",
                    "type": "text"
                }
            ]
        },
    ],
    documents: [
        {
            path: '/',
            name: "NAM102_Application_for_Name_Change.pdf",
            btnText: "Form NAM102 (Application for Name Change)",
            btnIcon: "description",
            inputFields: [
                'currentFirstName',
                'currentMiddleName',
                'currentLastName',
                'address',
                'city',
                'state',
                'zip',
                'county',
                'dateOfBirth',
                'newFirstName',
                'newMiddleName',
                'newLastName',
                'newSex',
                'sexOnBirthRecords',
                'legallyBindingSignature',
                'phone',
                'email',
            ],
            pdfFields: {
                fullname: 'text',
                address: 'text',
                citystatezip: 'text',
                county: 'text',
                first: 'text',
                middle: 'text',
                last: 'text',
                dob: 'text',
                doSkipSpouse: 'checkbox',
                doSkipChildren: 'checkbox',
                doSkipChildren1: 'checkbox',
                doNameChange: 'checkbox',
                first1: 'text',
                middle1: 'text',
                last1: 'text',
                newfirst: 'text',
                newmiddle: 'text',
                newlast: 'text',
                doBirthRecordChange: 'checkbox',
                newfirst1: 'text',
                newmiddle1: 'text',
                newlast1: 'text',
                doSexChange: 'checkbox',
                newsex: 'text',
                oldsex: 'text',
                doPrivate: 'checkbox',
                doPrivateName: 'checkbox',
                doPrivateSex: 'checkbox',
                hasNoCriminalHistory: 'checkbox',
                hasNoLand: 'checkbox',
                date: 'text',
                fullname1: 'text',
                signature: 'text',
                address1: 'text',
                countyandstate: 'text',
                citystatezip1: 'text',
                phone: 'text',
                email: 'text',
            },
            build: (data) => {
                return {
                    "fullname": `${data.currentFirstName} ${data.currentMiddleName} ${data.currentLastName}`,
                    "address": data.address,
                    "citystatezip": `${data.city}, ${data.state} ${data.zip}`,
                    "county": data.county,
                    "first": data.currentFirstName,
                    "middle": data.currentMiddleName,
                    "last": data.currentLastName,
                    "dob": formatDate(data.dateOfBirth),
                    "doSkipSpouse": true,
                    "doSkipChildren": true,
                    "doSkipChildren1": true,
                    "doNameChange": true,
                    "first1": data.currentFirstName,
                    "middle1": data.currentMiddleName,
                    "last1": data.currentLastName,
                    "newfirst": data.newFirstName,
                    "newmiddle": data.newMiddleName,
                    "newlast": data.newLastName,
                    "doBirthRecordChange": true,
                    "newfirst1": data.newFirstName,
                    "newmiddle1": data.newMiddleName,
                    "newlast1": data.newLastName,
                    "doSexChange": true,
                    "newsex": data.newSex,
                    "oldsex": data.sexOnBirthRecords,
                    "doPrivate": true,
                    "doPrivateName": true,
                    "doPrivateSex": true,
                    "hasNoCriminalHistory": true,
                    "hasNoLand": true,
                    "date": formatDate(new Date()),
                    "fullname1": `${data.newFirstName} ${data.newMiddleName} ${data.newLastName} (${data.currentFirstName} ${data.currentMiddleName} ${data.currentLastName})`,
                    "signature": data.legallyBindingSignature,
                    "address1": data.address,
                    "countyandstate": `${data.county}, ${data.state}`,
                    "citystatezip1": `${data.city}, ${data.state} ${data.zip}`,
                    "phone": data.phone,
                    "email": data.email,
                }
            }
        },
        {
            path: '/',
            name: 'NAM103_Criminal_History_Check_Release.pdf',
            btnText: "Form NAM103 (Criminal History Check Release)",
            btnIcon: "security",
            inputFields: [
                'currentFirstName',
                'currentMiddleName',
                'currentLastName',
                'newFirstName',
                'newMiddleName',
                'newLastName',
                'dateOfBirth',
                'sexOnBirthRecords',
                'race',
                'legallyBindingSignature'
            ],
            pdfFields: {
                name: 'text',
                nickname: 'text',
                dob: 'text',
                isF: 'checkbox',
                isM: 'checkbox',
                race: 'text',
                signature: 'text'
            },
            build: (data) => {
                return {
                    "name": `${data.currentFirstName} ${data.currentMiddleName} ${data.currentLastName}`,
                    "nickname": `${data.newFirstName} ${data.newMiddleName} ${data.newLastName}`,
                    "dob": formatDate(data.dateOfBirth),
                    "isF": data.sexOnBirthRecords.toLowerCase().indexOf('female') !== -1,
                    "isM": data.sexOnBirthRecords.toLowerCase().indexOf('female') === -1,
                    "race": data.race,
                    "signature": data.legallyBindingSignature
                }
            }
        },
        {
            path: '/',
            name: 'NAM107_Proposed_Order_Granting_Name_Change.pdf',
            btnText: "Form NAM107 (Proposed Order Granting Name Change)",
            btnIcon: "gavel",
            inputFields: [
                'currentFirstName',
                'currentMiddleName',
                'currentLastName',
                'address',
                'city',
                'state',
                'zip',
                'county',
                'dateOfBirth',
                'newFirstName',
                'newMiddleName',
                'newLastName',
                'newSex'
            ],
            pdfFields: {
                name: 'text',
                newName: 'text',
                fullAddress: 'text',
                county: 'text',
                nameAndDob: 'text',
                noSpouse: 'checkbox',
                noChildren: 'checkbox',
                doNameChange: 'checkbox',
                newName1: 'text',
                doBirthRecordChange: 'checkbox',
                newName2: 'text',
                doSexChange: 'checkbox',
                newSex: 'text',
                doConfidential: 'checkbox',
                doConfidentialName: 'checkbox',
                doConfidentialSex: 'checkbox'
            },
            build: (data) => {
                return {
                    "name": `${data.currentFirstName} ${data.currentMiddleName} ${data.currentLastName}`,
                    "newName": `${data.newFirstName} ${data.newMiddleName} ${data.newLastName}`,
                    "fullAddress": `${data.address}, ${data.city}, ${data.state} ${data.zip}`,
                    "county": data.county,
                    "nameAndDob": `${data.currentFirstName} ${data.currentMiddleName} ${data.currentLastName} (${formatDate(data.dateOfBirth)})`,
                    "noSpouse": true,
                    "noChildren": true,
                    "doNameChange": true,
                    "newName1": `${data.newFirstName} ${data.newMiddleName} ${data.newLastName}`,
                    "doBirthRecordChange": true,
                    "newName2": `${data.newFirstName} ${data.newMiddleName} ${data.newLastName}`,
                    "doSexChange": true,
                    "newSex": data.newSex,
                    "doConfidential": true,
                    "doConfidentialName": true,
                    "doConfidentialSex": true
                }
            }
        }
    ],
    onload: () => {
        document.querySelectorAll('#sexOnBirthRecords, #newSex').forEach((el: HTMLInputElement) => el.addEventListener('change', (e) => {
            const sexOnBirthRecords = (document.getElementById('sexOnBirthRecords') as HTMLInputElement);
            const newSex = (document.getElementById('newSex') as HTMLInputElement)

            if (sexOnBirthRecords.value === 'NA') {
                alert('You are seen, however unfortunately, I simply do not know how to generate the correct forms for intersex people. You should should reach out to the Volunteer Lawyers Network for guidance.')
                sexOnBirthRecords.value = '';
            }

            if (newSex.value === 'X') {
                alert('Changing your gender marker to X is a risk-benefit type decision that you should make with the help of an attorney. You can self designate X on an ID, but again this has far reaching implications that I don\'t have the expertise to advise on. You should should reach out to the Volunteer Lawyers Network for guidance.')
                newSex.value = '';
            }

            if (sexOnBirthRecords.value === newSex.value && sexOnBirthRecords.value !== '') {
                alert('This form generator is designed for trans people changing their name AND gender. If you are looking to NOT change your gender, this form may not be the best fit for you. At the bare minimum you will require manually editing the generated PDFs.')
                sexOnBirthRecords.value = '';
                newSex.value = '';
            }
        }))
    },
    onGenerate: (form: PDFForm) => {
        form.getFields().forEach(field => {
            if (field.constructor.name === 'PDFCheckBox') {
                field.enableReadOnly();
            }
        });
    }
}

export default Config
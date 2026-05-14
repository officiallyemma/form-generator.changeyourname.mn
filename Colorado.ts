import { PDFDocument, PDFForm, rgb, degrees } from "pdf-lib";
import type { FormGeneratorConfig } from "./Config"
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
    version: "0.0.0",
    form: [
        {
            type: "comment",
            html: `
            <div class="card header-card">
            <img src="banner.webp" height="100" alt="Name Change Form Generator" />
            <h1>Colorado Trans Name Change Court Document Generator</h1>
            <p class="body-text">
               Copy Goes Here
                <br />
                <br />
                This form makes a number of assumptions in order to "just work" for the most amount of people. Please see the full list of assumptions this form generator will make on the
                <a href="https://changeyourname.mn#introduction">main page</a>
                .
            </p>


            <div class="sub-card sub-card--info">
                <p>
                <strong>Security Notice:</strong>
                Everything runs locally in your browser, meaning your data doesn't get sent anywhere. This app is
                <a href="https://github.com/officiallyemma/form-generator.changeyourname.mn" target="_blank" rel="noopener">open source</a> and you're welcome to review or audit the code yourself.
                </p>
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
                },
                {
                    id: "race",
                    label: "Race",
                    supportingText: "Race for NAM103",
                    type: "text",
                },
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
            headerText: "3. Sex/Gender Information",
            headerIcon: "wc",
            fields: [
                {
                    id: "sexOnBirthRecords",
                    label: "Assigned Sex at Birth",
                    supportingText: "Your sex as it appears on your birth certificate now",
                    type: "select",
                    options: [
                        { value: "female", label: "Female" },
                        { value: "male", label: "Male" },
                        { value: "NA", label: "Not Listed" },
                    ],
                },
                {
                    id: "newSex",
                    label: "Amended Sex on Birth Records",
                    supportingText: "Your sex as you want it on your birth certificate",
                    type: "select",
                    options: [
                        { value: "female", label: "Female" },
                        { value: "male", label: "Male" },
                        { value: "X", label: "X" },
                    ],
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
                    supportingText: "e.g. Hennepin, Ramsey, Dakota",
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

                <div class="card">
                    <div class="sub-card sub-card--warning">
                        <h2>Insert Disclaimer Text Here Lorem Ipsum Don't Sue Me</h2>
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
            btnText: "xxxxx",
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
                    narrative: data.narrative
                };
            },
        }
    ],
    onload: () => {
        document.querySelectorAll("#sexOnBirthRecords, #newSex").forEach((el: HTMLInputElement) =>
            el.addEventListener("change", (e) => {
                const sexOnBirthRecords = document.getElementById("sexOnBirthRecords") as HTMLInputElement;
                const newSex = document.getElementById("newSex") as HTMLInputElement;

                if (sexOnBirthRecords.value === "NA") {
                    alert(
                        "You are seen, however unfortunately, I simply do not know how to generate the correct forms for intersex people. You should should reach out to the Volunteer Lawyers Network for guidance.",
                    );
                    sexOnBirthRecords.value = "";
                }

                if (newSex.value === "X") {
                    alert(
                        "Changing your gender marker to X is a risk-benefit type decision that you should make with the help of an attorney. You can self designate X on an ID, but again this has far reaching implications that I don't have the expertise to advise on. You should should reach out to the Volunteer Lawyers Network for guidance.",
                    );
                    newSex.value = "";
                }

                if (sexOnBirthRecords.value === newSex.value && sexOnBirthRecords.value !== "") {
                    alert(
                        "This form generator is designed for trans people changing their name AND gender. If you are looking to NOT change your gender, this form may not be the best fit for you. At the bare minimum you will require manually editing the generated PDFs.",
                    );
                    sexOnBirthRecords.value = "";
                    newSex.value = "";
                }
            }),
        );
    },
    onGenerate: (pdf: PDFDocument) => {


        // Get the first page of the document
        const pages = pdf.getPages()
        pages.forEach(page => {

            // Get the width and height of the first page
            const { width, height } = page.getSize()

            // Draw a string of text diagonally across the first page
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
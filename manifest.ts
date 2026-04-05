// this is the manifest file that describes the documents available for generation, the fields they contain, and how to build those fields from user input
// as you can see this manifest is just a JavaScript object that is exported from this file. JS is used for the manifest because it allows us to define build
// functions that can manipulate the user input and format it as needed for the PDF fields. For example, we can format dates, combine fields, or conditionally
// include certain fields based on the user's input using simple javascript expressions. We can even bring in more complex logic if needed, such as looking up
// information from an API or performing calculations. The manifest is designed to be flexible and extensible, so you can add as many documents and fields as 
// you need, and define the build functions in whatever way makes the most sense for your use case. As always no data is saved and all generation is done in-memory
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

module.exports = {
    name: 'mn-form-generator',
    version: '0.0.0',
    documents: [
        {
            path: 'dist/',
            name: "NAM102_Application_for_Name_Change.pdf",
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
            path: 'dist/',
            name: 'NAM103_Criminal_History_Check_Release.pdf',
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
            path: 'dist/',
            name: 'NAM107_Proposed_Order_Granting_Name_Change.pdf',
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
    ]
}


// const manifest = [
//     {
//         name: 'NAM107_Proposed_Order_Granting_Name_Change.pdf',
//         fields: {
//             name: TYPES.TEXT,
//             newName: TYPES.TEXT,
//             fullAddress: TYPES.TEXT,
//             county: TYPES.TEXT,
//             nameAndDob: TYPES.TEXT,
//             noSpouse: TYPES.CHECKBOX,
//             noChildren: TYPES.CHECKBOX,
//             doNameChange: TYPES.CHECKBOX,
//             newName1: TYPES.TEXT,
//             doBirthRecordChange: TYPES.CHECKBOX,
//             newName2: TYPES.TEXT,
//             doSexChange: TYPES.CHECKBOX,
//             newSex: TYPES.TEXT,
//             doConfidential: TYPES.CHECKBOX,
//             doConfidentialName: TYPES.CHECKBOX,
//             doConfidentialSex: TYPES.CHECKBOX
//         },
//         build: (data) => {
//             return {
//                 "name": `${data.currentFirstName} ${data.currentMiddleName} ${data.currentLastName}`,
//                 "newName": `${data.newFirstName} ${data.newMiddleName} ${data.newLastName}`,
//                 "fullAddress": `${data.address}, ${data.city}, ${data.state} ${data.zip}`,
//                 "county": data.county,
//                 "nameAndDob": `${data.currentFirstName} ${data.currentMiddleName} ${data.currentLastName} (${formatDate(data.dateOfBirth)})`,
//                 "noSpouse": true,
//                 "noChildren": true,
//                 "doNameChange": true,
//                 "newName1": `${data.newFirstName} ${data.newMiddleName} ${data.newLastName}`,
//                 "doBirthRecordChange": true,
//                 "newName2": `${data.newFirstName} ${data.newMiddleName} ${data.newLastName}`,
//                 "doSexChange": true,
//                 "newSex": data.newSex,
//                 "doConfidential": true,
//                 "doConfidentialName": true,
//                 "doConfidentialSex": true
//             }
//         }
//     },
//     {
//         name: 'NAM103_Criminal_History_Check_Release.pdf',
//         fields: {
//             name: TYPES.TEXT,
//             nickname: TYPES.TEXT,
//             dob: TYPES.TEXT,
//             isF: TYPES.CHECKBOX,
//             isM: TYPES.CHECKBOX,
//             race: TYPES.TEXT,
//             signature: TYPES.TEXT
//         },
//         build: (data) => {
//             return {
//                 "name": `${data.currentFirstName} ${data.currentMiddleName} ${data.currentLastName}`,
//                 "nickname": `${data.newFirstName} ${data.newMiddleName} ${data.newLastName}`,
//                 "dob": formatDate(data.dateOfBirth),
//                 "isF": data.sexOnBirthRecords.toLowerCase().indexOf('female') !== -1,
//                 "isM": data.sexOnBirthRecords.toLowerCase().indexOf('female') === -1,
//                 "race": data.race,
//                 "signature": data.legallyBindingSignature
//             }
//         }
//     },
//     {
//         name: "NAM102_Application_for_Name_Change.pdf",
//         fields: {
//             fullname: TYPES.TEXT,
//             address: TYPES.TEXT,
//             citystatezip: TYPES.TEXT,
//             county: TYPES.TEXT,
//             first: TYPES.TEXT,
//             middle: TYPES.TEXT,
//             last: TYPES.TEXT,
//             dob: TYPES.TEXT,
//             doSkipSpouse: TYPES.CHECKBOX,
//             doSkipChildren: TYPES.CHECKBOX,
//             doSkipChildren1: TYPES.CHECKBOX,
//             doNameChange: TYPES.CHECKBOX,
//             first1: TYPES.TEXT,
//             middle1: TYPES.TEXT,
//             last1: TYPES.TEXT,
//             newfirst: TYPES.TEXT,
//             newmiddle: TYPES.TEXT,
//             newlast: TYPES.TEXT,
//             doBirthRecordChange: TYPES.CHECKBOX,
//             newfirst1: TYPES.TEXT,
//             newmiddle1: TYPES.TEXT,
//             newlast1: TYPES.TEXT,
//             doSexChange: TYPES.CHECKBOX,
//             newsex: TYPES.TEXT,
//             oldsex: TYPES.TEXT,
//             doPrivate: TYPES.CHECKBOX,
//             doPrivateName: TYPES.CHECKBOX,
//             doPrivateSex: TYPES.CHECKBOX,
//             hasNoCriminalHistory: TYPES.CHECKBOX,
//             hasNoLand: TYPES.CHECKBOX,
//             date: TYPES.TEXT,
//             fullname1: TYPES.TEXT,
//             signature: TYPES.TEXT,
//             address1: TYPES.TEXT,
//             countyandstate: TYPES.TEXT,
//             citystatezip1: TYPES.TEXT,
//             phone: TYPES.TEXT,
//             email: TYPES.TEXT,
//         },
//         build: (data) => {
//             return {
//                 "fullname": `${data.currentFirstName} ${data.currentMiddleName} ${data.currentLastName}`,
//                 "address": data.address,
//                 "citystatezip": `${data.city}, ${data.state} ${data.zip}`,
//                 "county": data.county,
//                 "first": data.currentFirstName,
//                 "middle": data.currentMiddleName,
//                 "last": data.currentLastName,
//                 "dob": formatDate(data.dateOfBirth),
//                 "doSkipSpouse": true,
//                 "doSkipChildren": true,
//                 "doSkipChildren1": true,
//                 "doNameChange": true,
//                 "first1": data.currentFirstName,
//                 "middle1": data.currentMiddleName,
//                 "last1": data.currentLastName,
//                 "newfirst": data.newFirstName,
//                 "newmiddle": data.newMiddleName,
//                 "newlast": data.newLastName,
//                 "doBirthRecordChange": true,
//                 "newfirst1": data.newFirstName,
//                 "newmiddle1": data.newMiddleName,
//                 "newlast1": data.newLastName,
//                 "doSexChange": true,
//                 "newsex": data.newSex,
//                 "oldsex": data.sexOnBirthRecords,
//                 "doPrivate": true,
//                 "doPrivateName": true,
//                 "doPrivateSex": true,
//                 "hasNoCriminalHistory": true,
//                 "hasNoLand": true,
//                 "date": formatDate(new Date()),
//                 "fullname1": `${data.newFirstName} ${data.newMiddleName} ${data.newLastName} (${data.currentFirstName} ${data.currentMiddleName} ${data.currentLastName})`,
//                 "signature": data.legallyBindingSignature,
//                 "address1": data.address,
//                 "countyandstate": `${data.county}, ${data.state}`,
//                 "citystatezip1": `${data.city}, ${data.state} ${data.zip}`,
//                 "phone": data.phone,
//                 "email": data.email,
//             }
//         }
//     }
// ]

# Deadname Deleter

### Live at: form-generator.ChangeYourName.MN

#### Purpose:
This Node.js server helps Trans people in Minnesota generate legal name change PDFs-- Although the software is easily adaptable to many PDF generation tasks. Users fill out a web form, which maps to PDF templates defined in a manifest. PDFs are generated in memory and returned to the user. No data is stored or logged.

#### Key Features

| Feature | Description |
|---------|-------------|
| **PDF Generation** | Dynamically fills PDF templates based on user input. |
| **No Data Retention** | PDFs processed in memory; nothing stored permanently. |
| **Manifest-Driven** | All PDFs and field mappings defined in a manifest (`manifest.js`). |
| **Custom Build Functions** | Map user input to PDF fields using Javascript expressions. |
| **Multiple Documents** | Supports multiple PDFs with independent mappings. |
| **Recaptcha Verification** | Optional Google reCAPTCHA v3 to protect form submissions. |
| **Analytics** | Tracks total generated PDFs. This is the only logging. |
| **Manifest Validation** | Checks manifest completeness, PDF field matches, and build function output. |
| **Test PDF Generation** | Generates temporary PDFs and JSON for manual inspection in `/tmp`. |
| **Safer Manifest Import** | Limits accidental Node API access with `saferImport`. |
| **Error Handling** | Validator errors halt startup; Recaptcha and input checks protect endpoints. |

#### Installation
Install OS dependencies (Linux only!! No Windows support):

```Bash
sudo apt-get install libcairo2-dev libpoppler-qt5-dev poppler-data
```
Install Node dependencies:
```Bash
npm i
```
Start the server:
```Bash
node FormGenerator.js
```
Environment variables:

- `PORT` – change default port 4747
- `RECAPTCHA_SECRET` – required reCAPTCHA secret for production
- `SKIP_RECAPTCHA=true` – skip reCAPTCHA for testing

#### Adding or Editing Forms

## 1. Create PDFs with fillable fields

Using LibreOffice Draw: (you can also use Adobe Acrobat or other PDF editors, but LibreOffice is free and open source):

- Open PDF in LibreOffice Draw
- Enable Form Toolbars:
  - View > Toolbars > Form Controls
  - View > Toolbars > Form Design
- Turn on Design Mode
- Add Text Boxes or Checkboxes
- Name each field (Right Click > Control Properties > Name)
- Export as PDF with "Create PDF Form" checked



## 2. Define User Input

Input is a key-value store, for example:

```JSON
{
    currentFirstName: "John",
    currentLastName: "Doe",
    address: "123 Main St, Anytown, MN",
    children: 2
}
```


## 3. Define Manifest

Manifest:
```TS
type Manifest = {
    name: string,
    version: string,
    documents: {
        path: string,
        name: string,
        pdfFields: { [key: string]: 'text' | 'checkbox' },
        inputFields: string[],
        build: (data: any) => { [key: string]: string | boolean }
    }[]
}
```

Place this file in the root project directory as `manifest.js` or in `/etc/form-generator/manifest.js`.

```TS
module.exports = {
    "name": "Example Manifest",
    "version": "1.0",
    "documents": [
        {
            // define PDF template location and name
            "path": "./dist",
            "name": "example.pdf",
            // define fields that exist in the PDF, as well as their types
            "pdfFields": {
                "fullName": "text",
                "address": "text",
                "hasChildren": "checkbox"
            },
            // define which user input fields are needed to build the PDF fields
            "inputFields": ["currentFirstName", "currentLastName", "children"],
            // map user input to PDF fields using a JavaScript function. This is where you can do any necessary data transformation or formatting.
            "build": (data) => ({
                // we use a template string here to combine first and last name into a single fullName field for the PDF
                fullName: `${data.currentFirstName} ${data.currentLastName}`,
                // we can pass address directly since it doesn't need transformation
                address: data.address,
                // we dynamically generate a boolean value for the hasChildren checkbox based on whether the user input for children is greater than 0
                hasChildren: data.children > 0
            })
        }
    ]
}


```

The server will then serve autofilled pdf's when a recaptcha verified POST request is made to `/example.pdf` with the appropriate input fields.


#### Validator
On startup, the server validates PDF files and their fields against the manifest. Any errors in mapping or missing fields should be caught.

#### Runtime watchdog
Manifests are prevented from accessing console, file system, network, or other Node APIs. If a manifest tries to do anything sketchy, the server shuts down. This is not designed to protect you from bad actors, but rather to prevent you from accidentally shooting yourself in the foot and logging/saving user data.

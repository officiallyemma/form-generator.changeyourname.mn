import fs from 'fs/promises'; // interact with the filesystem to load the manifest and write/delete temp PDF's (for validation only) on startup
import path from 'path'; // handle file paths for loading the manifest and PDF templates for generation
import pdfFillForm from 'pdf-fill-form'; // does the actual heavy lifting of reading PDF templates and filling in the fields with user data
import { saferImport } from './saferImport.js'; // a safer way to import the manifest file, blocking access to dangerous Node modules and APIs. Not foolproof.
import 'dotenv/config'; // load env vars from .env file
import express from "express"; // host a webserver
import bodyParser from 'body-parser'; // parse incoming form data
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
class FormGenerator {
    constructor() {
        this.counter = 0;
    }
    async init() {
        console.log(Date.now());
        if (process.env.RECAPTCHA_SECRET === undefined) {
            if (!process.env.SKIP_RECAPTCHA) {
                console.warn("[Fatal] RECAPTCHA_SECRET environment variable is not set. Set SKIP_RECAPTCHA=true to bypass this check, but this is not recommended for production use.");
                process.exit(1);
            }
            else {
                console.warn("[Warning] RECAPTCHA_SECRET environment variable is not set, but SKIP_RECAPTCHA=true so we continue startup. This is not recommended for production use.");
            }
        }
        this.initCounter();
        await this.loadManifest();
        await this.validateManifest();
        this.initServer();
    }
    // load the manifest file, killing the process if it can't be found or loaded
    async loadManifest() {
        const localManifestPath = path.resolve(__dirname, '.', 'manifest.js');
        const systemManifestPath = path.resolve('/etc/deadname-deleter', 'manifest.js');
        // prefer system level manifest if it exists
        let manifestPath;
        try {
            await fs.access(systemManifestPath);
            manifestPath = systemManifestPath;
        }
        catch {
            manifestPath = localManifestPath;
        }
        try {
            await fs.access(manifestPath);
            // we use saferImport here to limit damage from potential mistakes (PII logging, http access, etc) in the manifest file. 
            // This is not intended to block malicious code, but it should prevent most common issues and is better than nothing
            await saferImport(manifestPath).then(module => {
                console.log('Successfully loaded manifest from', manifestPath);
                this.manifest = module;
            });
        }
        catch (err) {
            console.error('No manifest file found at', localManifestPath, 'or', systemManifestPath, err);
            process.exit(1);
        }
    }
    // validate the manifest against the PDF files, killing the process if there are any errors
    async validateManifest() {
        if (!this.manifest.name || !this.manifest.version || !this.manifest.documents) {
            console.error('[validator error] Manifest is missing required fields (name, version, documents)');
            process.exit(1);
        }
        let prefix = `form-generator_validator_`;
        // clear tmp files from previous runs
        try {
            const files = await fs.readdir('/tmp');
            for (const file of files) {
                if (file.startsWith(prefix)) {
                    await fs.unlink(path.resolve('/tmp', file));
                }
            }
        }
        catch (err) {
            // ignore if /tmp doesn't exist
        }
        // validate each document
        for (let i = 0; i < this.manifest.documents.length; i++) {
            const doc = this.manifest.documents[i];
            if (!doc.name || !doc.pdfFields || !doc.inputFields || !doc.path || !doc.build || typeof doc.build !== 'function') {
                console.error(`[validator error] Document index ${i} is missing one or more required fields`);
                process.exit(1);
            }
            try {
                await fs.access(path.resolve(doc.path, doc.name));
            }
            catch {
                console.error(`[validator error] PDF file for document index ${i} not found at path: ${path.resolve(doc.path, doc.name)}`);
                process.exit(1);
            }
            await pdfFillForm.read(doc.path + doc.name).then(async (result) => {
                let pdfFields = {};
                result.forEach((field) => {
                    pdfFields[field.name] = field.type;
                });
                // warn if PDF defines a field that is missing from the manifest
                Object.keys(pdfFields).forEach(field => {
                    if (!doc.pdfFields[field]) {
                        console.warn(`[validator warning] PDF (doc index ${i}) defines a field which is missing from the manifest: ${field}`);
                    }
                });
                // fail if field is defined in the manifest but missing from the PDF 
                Object.keys(doc.pdfFields).forEach(field => {
                    if (!pdfFields[field]) {
                        console.error(`[validator error] Manifest (doc index ${i}) defines a field which is missing from the PDF: ${field}`);
                        process.exit(1);
                    }
                });
                // input test data into the build function and make sure it produces output without undefined's
                let testInput = {};
                doc.inputFields.forEach(field => {
                    testInput[field] = crypto.randomUUID().split('-')[0];
                });
                let testBuild = doc.build(testInput);
                if (JSON.stringify(testBuild).indexOf('undefined') !== -1) {
                    console.error(`[validator error] Build function for document index ${i} is producing undefined values.`, 'Input: ', testInput, 'Output:', testBuild);
                    process.exit(1);
                }
                // input this test data into the PDF
                let testPDF = pdfFillForm.writeSync(doc.path + doc.name, testBuild, { "save": "pdf" });
                // write the resulting PDF and the test input data to /tmp for manual inspection
                let filename = `${prefix}${i}_${Date.now()}`;
                await fs.writeFile(path.resolve('/tmp', filename + '.pdf'), testPDF);
                await fs.writeFile(path.resolve('/tmp', filename + '.json'), JSON.stringify(testInput, null, 2));
                console.log(`[validator success] Successfully validated document: ${doc.name}. Found ${Object.keys(pdfFields).length} fields in the PDF and ${Object.keys(doc.pdfFields).length} fields in the manifest. Check /tmp for generated test PDF.`);
            }).catch((err) => {
                console.error(`[validator error] Error reading PDF for document index ${i} (${doc.name}):`, err);
                process.exit(1);
            });
        }
    }
    async initCounter() {
        const COUNTER_FILE = path.resolve(process.env.HOME + '/.local/share/deadname-deleter', 'counter.txt');
        this.saveCounter = async () => {
            try {
                await fs.mkdir(path.dirname(COUNTER_FILE), { recursive: true });
                await fs.writeFile(COUNTER_FILE, String(this.counter), { encoding: 'utf8' });
            }
            catch (err) {
                console.error('Failed to write counter.txt:', err);
            }
        };
        try {
            const raw = (await fs.readFile(COUNTER_FILE, 'utf8')).trim();
            const parsed = parseInt(raw);
            console.log(`Loaded counter value: ${parsed} from ${COUNTER_FILE}`);
            if (!Number.isNaN(parsed)) {
                this.counter = parsed;
            }
            else {
                console.warn('counter.txt does not contain a valid number; defaulting to 0');
                await fs.copyFile(COUNTER_FILE, COUNTER_FILE + '.bak'); // backup the invalid file just in case
                await this.saveCounter(); // override the invalid file with 0
            }
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                console.warn('counter.txt not found; starting counter at 0');
                await this.saveCounter();
            }
            else {
                console.error('Error reading counter.txt:', err);
            }
        }
    }
    initServer() {
        this.app = express();
        this.app.use(bodyParser.urlencoded());
        // serve static content
        this.app.use(express.static('dist'));
        this.registerRoutes();
        let port = process.env.PORT || 4747;
        this.app.listen(port, () => {
            console.log(`Listening on port ${port}. View: http://localhost:${port}`);
        });
    }
    registerRoutes() {
        this.app.get('/counter', (req, res) => {
            res.send(this.counter);
        });
        // for each document in the manifest, make a new POST endpoint
        this.manifest.documents.forEach((doc) => {
            this.app.post(`/${doc.name}`, async (req, res) => {
                let captchaResponse;
                // generate fields based on user input (using a build function from the manifest)
                let fields = doc.build(req.body);
                // validate built fields
                Object.keys(fields).forEach(key => {
                    if (fields[key] === undefined ||
                        (typeof fields[key] === 'string' && fields[key].indexOf('undefined') !== -1)) {
                        console.warn(`[Warning] Build function for document ${doc.name} produced undefined value for field ${key}.`);
                        // return res.status(500).send('Internal server error during PDF generation.');
                    }
                    if (typeof fields[key] === 'string' && fields[key].length > 1000) {
                        return res.status(413).send('Field value too long. Please check your input and try again.');
                    }
                });
                if (req.hostname !== 'localhost' && !process.env.SKIP_RECAPTCHA) {
                    if (!req.body['g-recaptcha-response']) {
                        return res.status(400).send('Recaptcha response is required.');
                    }
                    captchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${req.body['g-recaptcha-response']}`, {
                        method: 'POST'
                    }).catch(err => {
                        console.error('Recaptcha verification error:', err);
                        return res.status(500).send('Internal server error during recaptcha verification.');
                    });
                    captchaResponse = await captchaResponse.json();
                    if (!captchaResponse.success) {
                        return res.status(400).send('Recaptcha verification failed.');
                    }
                    if (captchaResponse.score < 0.5) {
                        return res.status(403).send('Recaptcha score too low. Please try again.');
                    }
                    // analytics (no PII)
                    this.counter += 1;
                    this.saveCounter();
                }
                pdfFillForm.write(path.resolve(doc.path, doc.name), fields, { "save": "pdf" }).then((pdf) => {
                    res.setHeader('Content-Disposition', 'inline; filename="' + doc.name + '"');
                    res.setHeader('Content-Type', 'application/pdf');
                    res.send(pdf);
                    console.log(`[${new Date().toISOString()}] Generated ${doc.name} (total generated: ${this.counter})`);
                }).catch(err => {
                    console.error('Error generating PDF:', err);
                    return res.status(500).send('Internal server error during PDF generation.');
                });
            });
        });
    }
}
let generator = new FormGenerator();
generator.init();

import fs from 'fs'; // interact with the filesystem to load the manifest and write/delete temp PDF's (for validation only) on startup
import path from 'path'; // handle file paths for loading the manifest and PDF templates for generation
import pdfFillForm from 'pdf-fill-form'; // does the actual heavy lifting of reading PDF templates and filling in the fields with user data
import { saferImport } from './safeImport.js'; // a safer way to import the manifest file, blocking access to dangerous Node modules and APIs. Not foolproof.
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
    loadManifest() {
        return new Promise((resolve, reject) => {
            const localManifestPath = path.resolve(__dirname, '.', 'manifest.js');
            const systemManifestPath = path.resolve('/etc/deadname-deleter', 'manifest.js');
            // prefer system level manifest if it exists
            const manifestPath = fs.existsSync(systemManifestPath) ? systemManifestPath : localManifestPath;
            if (fs.existsSync(manifestPath)) {
                let manifest;
                try {
                    // we use saferImport here to limit damage from potential mistakes (PII logging, http access, etc) in the manifest file. 
                    // This is not intended to block malicious code, but it should prevent most common issues and is better than nothing
                    manifest = saferImport(manifestPath).then(module => {
                        console.log('Successfully loaded manifest from', manifestPath);
                        this.manifest = module;
                        resolve();
                    });
                }
                catch (err) {
                    console.error('Error loading manifest from', manifestPath, err);
                    process.exit(1);
                }
            }
            else {
                console.error('No manifest file found at', localManifestPath, 'or', systemManifestPath);
                process.exit(1);
            }
        });
    }
    // validate the manifest against the PDF files, killing the process if there are any errors
    validateManifest() {
        return new Promise((resolve, reject) => {
            if (!this.manifest.name || !this.manifest.version || !this.manifest.documents) {
                console.error('[validator error] Manifest is missing required fields (name, version, documents)');
                process.exit(1);
            }
            let prefix = `form-generator_validator_`;
            // clear tmp files from previous runs
            fs.readdirSync('/tmp').forEach(file => {
                if (file.startsWith(prefix)) {
                    fs.unlinkSync(path.resolve('/tmp', file));
                }
            });
            // validate each document
            this.manifest.documents.forEach((doc, i) => {
                if (!doc.name || !doc.pdfFields || !doc.inputFields || !doc.path || !doc.build || typeof doc.build !== 'function') {
                    console.error(`[validator error] Document index ${i} is missing one or more required fields`);
                    process.exit(1);
                }
                if (!fs.existsSync(path.resolve(doc.path, doc.name))) {
                    console.error(`[validator error] PDF file for document index ${i} not found at path: ${path.resolve(doc.path, doc.name)}`);
                    process.exit(1);
                }
                pdfFillForm.read(doc.path + doc.name).then((result) => {
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
                    fs.writeFileSync(path.resolve('/tmp', filename + '.pdf'), testPDF);
                    fs.writeFileSync(path.resolve('/tmp', filename + '.json'), JSON.stringify(testInput, null, 2));
                    console.log(`[validator success] Successfully validated document: ${doc.name}. Found ${Object.keys(pdfFields).length} fields in the PDF and ${Object.keys(doc.pdfFields).length} fields in the manifest. Check /tmp for generated test PDF.`);
                    resolve();
                }).catch((err) => {
                    console.error(`[validator error] Error reading PDF for document index ${i} (${doc.name}):`, err);
                    process.exit(1);
                });
            });
        });
    }
    initCounter() {
        const COUNTER_FILE = path.resolve(process.env.HOME + '/.local/share/form-generator', 'counter.txt');
        this.saveCounter = () => {
            try {
                fs.mkdirSync(path.dirname(COUNTER_FILE), { recursive: true });
                fs.writeFileSync(COUNTER_FILE, String(this.counter), 'utf8');
            }
            catch (err) {
                console.error('Failed to write counter.txt:', err);
            }
        };
        try {
            const raw = fs.readFileSync(COUNTER_FILE, 'utf8').trim();
            const parsed = parseInt(raw);
            console.log(`Loaded counter value: ${parsed} from ${COUNTER_FILE}`);
            if (!Number.isNaN(parsed)) {
                this.counter = parsed;
            }
            else {
                console.warn('counter.txt does not contain a valid number; defaulting to 0');
                fs.copyFileSync(COUNTER_FILE, COUNTER_FILE + '.bak'); // backup the invalid file just in case
                this.saveCounter(); // override the invalid file with 0
            }
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                console.warn('counter.txt not found; starting counter at 0');
                this.saveCounter();
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
            this.app.post(`/${doc.name}`, (req, res) => {
                let fields = doc.build(req.body);
                // fetch recaptcha 3
                if (!req.body['g-recaptcha-response']) {
                    return res.status(400).send('Recaptcha response is required.');
                }
                fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${req.body['g-recaptcha-response']}`, {
                    method: 'POST'
                })
                    .then((response) => response.json())
                    .then((data) => {
                    console.log(data);
                    if (data.hostname !== 'localhost' && !process.env.SKIP_RECAPTCHA) {
                        if (!data.success) {
                            return res.status(400).send('Recaptcha verification failed.');
                        }
                        if (data.score < 0.5) {
                            return res.status(400).send('Recaptcha score too low. Please try again.');
                        }
                    }
                    // if all is well, generate the PDF
                    // analytics (no PII)
                    this.counter += 1;
                    this.saveCounter();
                    console.log(`[${new Date().toISOString()}] Generated ${doc.name} (total generated: ${this.counter})`);
                    var pdf = pdfFillForm.writeSync(doc.path + doc.name, fields, { "save": "pdf" });
                    res.setHeader('Content-Disposition', 'inline; filename="' + doc.name + '"');
                    res.setHeader('Content-Type', 'application/pdf');
                    res.send(pdf);
                })
                    .catch(err => {
                    console.error('Recaptcha verification error:', err);
                    return res.status(500).send('Internal server error during recaptcha verification.');
                });
            });
        });
    }
}
let generator = new FormGenerator();
generator.init();

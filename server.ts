import express from 'express';
import fs from 'fs';
import path from 'path';

let counter = -1;
const COUNTER_FILE = path.resolve(process.env.HOME + '/.local/share/form-generator', 'counter.txt');


function saveCounter() {
    try {
        fs.mkdirSync(path.dirname(COUNTER_FILE), { recursive: true });
        fs.writeFileSync(COUNTER_FILE, String(counter), 'utf8');
    } catch (err) {
        console.error('Failed to write counter.txt:', err);
        console.log('Counter value that failed to save:', counter);
    }
}

try {
    const raw = fs.readFileSync(COUNTER_FILE, 'utf8').trim();
    const parsed = parseInt(raw);
    console.log(`Loaded counter value: ${parsed} from ${COUNTER_FILE}`);
    if (!Number.isNaN(parsed)) {
        counter = parsed;
    } else {
        console.warn('counter.txt does not contain a valid number; defaulting to 0');
        fs.copyFileSync(COUNTER_FILE, COUNTER_FILE + '.bak'); // backup the invalid file just in case
        saveCounter() // override the invalid file with 0
    }
} catch (err) {
    if (err.code === 'ENOENT') {
        console.warn('counter.txt not found; starting counter at 0');
        saveCounter()
    } else {
        console.error('Error reading counter.txt:', err);
    }
}


// serve counter at /counter endpoint and /increment to incremement with ratelimit
const app = express();

app.get('/counter', (req, res) => {
    res.send(String(counter));
});

app.post('/increment', (req, res) => {
    counter++;
    saveCounter();
    res.send(String(counter));
});

const PORT = process.env.PORT || 4747;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
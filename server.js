"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var fs_1 = require("fs");
var path_1 = require("path");
var counter = -1;
var COUNTER_FILE = path_1.default.resolve((_a = process.env.HOME) !== null && _a !== void 0 ? _a : '.' + '/.local/share/form-generator', 'counter.txt');
function saveCounter() {
    try {
        fs_1.default.mkdirSync(path_1.default.dirname(COUNTER_FILE), { recursive: true });
        fs_1.default.writeFileSync(COUNTER_FILE, String(counter), 'utf8');
    }
    catch (err) {
        console.error('Failed to write counter.txt:', err);
        console.log('Counter value that failed to save:', counter);
    }
}
try {
    var raw = fs_1.default.readFileSync(COUNTER_FILE, 'utf8').trim();
    var parsed = parseInt(raw);
    console.log("Loaded counter value: ".concat(parsed, " from ").concat(COUNTER_FILE));
    if (!Number.isNaN(parsed)) {
        counter = parsed;
    }
    else {
        console.warn('counter.txt does not contain a valid number; defaulting to 0');
        fs_1.default.copyFileSync(COUNTER_FILE, COUNTER_FILE + '.bak'); // backup the invalid file just in case
        saveCounter(); // override the invalid file with 0
    }
}
catch (err) {
    if (err.code === 'ENOENT') {
        console.warn('counter.txt not found; starting counter at 0');
        saveCounter();
    }
    else {
        console.error('Error reading counter.txt:', err);
    }
}
// serve counter at /counter endpoint and /increment to incremement with ratelimit
var app = (0, express_1.default)();
app.get('/counter', function (req, res) {
    res.send(String(counter));
});
app.post('/increment', function (req, res) {
    counter++;
    saveCounter();
    res.send(String(counter));
});
var PORT = process.env.PORT || 4747;
app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});

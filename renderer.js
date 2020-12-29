
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const textbody = `
    function cat() {
        try {
            console.log('this is a test cat');
        } catch (e) {
            return false;
        }
        return null;
    }
    function dog() {
        try {
            console.log('this is a test dog');
        } catch (e) {
            return false;
        }
        return null;
    }
`;

function tokenize(str) {
    let lastChar = '';
    let char = '';
    let token = '';
    let tokens = [];

    // Trim extra whitespace by enforcing only one whitespace character in a row
    for (let i = 0; i < str.length; i++) {

        // Current char
        char = str[i];

        // End of token?
        if (char === ' ') {
            // Yes, add token to the result array
            if (!token.length) continue;
            tokens.push(token);
            token = '';
            if (lastChar === ' ') continue;
        }
        // No, add char to token str
        else {
            token += char;
        }

        lastChar = char;
    }
    return tokens;
}

String.prototype.hashCode = function(){
    var hash = 0;
    for (var i = 0; i < this.length; i++) {
        var character = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function parseTokens(tokens) {
    let rules = [
        {
            pattern: 'function',
            fillProps: (instance, startingTokenIndex) => {
                instance.type = 'function';
                instance.name = tokens[startingTokenIndex + 1];
            }
        },
        {
            pattern: 'try',
            fillProps: (instance, startingTokenIndex) => {
                instance.type = 'trycatch';
            }
        }
    ];
    let objects = [];
    let token;
    let rule;
    for (let i = 0; i < tokens.length; i++) {
        token = tokens[i];
        for (let j = 0; j < rules.length; j++) {
            rule = rules[j];
            if (token === rule.pattern) {
                let obj = {};
                rule.fillProps(obj, i);
                objects.push(obj);
            }
        }
    }
    return objects;
}

function normalizeBody(str) {
    return str.replace(/\r?\n|\r/g, '');
}


// Main loop
let lastHash = null;
setInterval(() => {
    let input = document.querySelector('#input').value;
    let normalizedBody = normalizeBody(input);
    let normalizedBodyTokens = tokenize(normalizedBody);
    let objects = parseTokens(normalizedBodyTokens);
    let hash = window.hash(objects);
    if (lastHash === hash) return; // don't do anything if nothing changed
    lastHash = hash;
    let outputDiv = document.querySelector('#output');
    let html = '';
    for (let obj of objects) {
        if (obj.type === 'function') {
            html += `
                <div class="function-wrap">
                    ${obj.name}
                </div>
                <br/>
            `;
        }
        if (obj.type === 'trycatch') {
            html += `
                <div class="trycatch-wrap">
                    try/catch
                </div>
                <br/>
            `;
        }
    }
    outputDiv.innerHTML = html;
}, 1000);
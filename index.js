const TokenRules = require('./tokenrules.js');
const Helpers = require('./helpers.js');

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

function parseTokens(tokens) {
    let rules = [
        {
            pattern: 'function',
            fillProps: (instance, startingTokenIndex) => {
                instance.type = 'function definition';
                instance.name = tokens[startingTokenIndex + 1];
            }
        },
        {
            pattern: 'try',
            fillProps: (instance, startingTokenIndex) => {
                instance.type = 'try/catch';
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
    return textbody.replace(/\r?\n|\r/g, '');
}


let normalizedBody = normalizeBody(textbody);
let normalizedBodyTokens = tokenize(normalizedBody);
let objects = parseTokens(normalizedBodyTokens);
debugger
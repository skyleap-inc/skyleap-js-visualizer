const { remote } = require('electron');
const objhash = require('object-hash');

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

//let currWindow = remote.BrowserWindow.getFocusedWindow();

window.hash = function(obj) {
    return objhash(obj);
}
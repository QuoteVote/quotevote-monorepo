const fs = require('fs');
let html = fs.readFileSync('client/index.html', 'utf8');
const ogTitle = 'Test Title';
html = html.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${ogTitle}" />`);
console.log("Matched:", html.includes(ogTitle));

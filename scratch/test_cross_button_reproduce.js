const fs = require('fs');

// Load buyer-marketplace.js code into an isolated environment
const jsContent = fs.readFileSync('assets/buyer-marketplace.js', 'utf-8');

console.log("Analyzing assets/buyer-marketplace.js for closeBuyerModal implementation...");

// Check closeBuyerModal in jsContent
const match = jsContent.match(/window\.closeBuyerModal\s*=\s*function[\s\S]*?^  \};/m);
if (match) {
  console.log("Current closeBuyerModal definition:\n", match[0]);
} else {
  console.log("closeBuyerModal definition pattern not matched exactly");
}

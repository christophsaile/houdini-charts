const execSync = require('child_process').execSync;
const argv = require('yargs').argv;

const url = new URL(argv.url);

let runs = 0;
let runLimit = argv.runs;

do {
  console.log('\x1b[33m', `Starting performance test ${runs + 1}`, '\x1b[0m');
  try {
    execSync(`node index.js --url ${url}`);
  } catch (err) {
    console.log('\x1b[31m', `Performance test ${runs + 1} failed`, '\x1b[0m');
    break;
  }
  console.log('\x1b[33m', `Finished running performance test ${runs + 1}`, '\x1b[0m');
  runs++;
} while (runs < runLimit);
console.log('\x1b[32m', `All finished`, '\x1b[0m');

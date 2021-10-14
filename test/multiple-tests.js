const execSync = require('child_process').execSync;
const argv = require('yargs').argv;

let runs = 0;
let runLimit = argv.runs;

do {
  console.log('\x1b[33m', `Starting performance test ${runs + 1}`, '\x1b[0m');
  try {
    execSync(
      `node index.js --run ${
        runs + 1
      } --url https://houdini-charts.netlify.app/01-houdinicharts/line-chart.html`
    );
  } catch (err) {
    console.log('\x1b[31m', `Performance test ${runs + 1} failed`, '\x1b[0m');
    break;
  }
  console.log('\x1b[33m', `Finished running performance test ${runs + 1}`, '\x1b[0m');
  runs++;
} while (runs < runLimit);
console.log('\x1b[32m', `All finished`, '\x1b[0m');

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const argv = require('yargs').argv;
const url = require('url');
const fs = require('fs');

const launchChromeAndRunLighthouse = (url) => {
  return chromeLauncher.launch({ chromeFlags: ['--headless'] }).then((chrome) => {
    const opts = {
      output: 'json',
      onlyCategories: ['performance'],
      port: chrome.port,
    };
    return lighthouse(url, opts).then((results) => {
      return chrome.kill().then(() => results.lhr);
    });
  });
};

if (argv.url) {
  const urlObj = new URL(argv.url);
  let fileName = `${urlObj.pathname.replaceAll('/', '_').replace('.html', '')}.json`;
  let filePath = `./results/${fileName}`;

  if (!fs.existsSync(filePath)) {
    const initJSON = { data: [] };
    fs.writeFile(filePath, JSON.stringify(initJSON), (err) => {
      if (err) throw err;
    });
  }

  launchChromeAndRunLighthouse(argv.url).then((results) => {
    const report = require(filePath);
    const newReportData = { url: results.finalUrl };
    report.data.push(newReportData);

    fs.writeFile(filePath, JSON.stringify(report), (err) => {
      if (err) throw err;
    });
  });
} else {
  throw "You haven't passed a URL to Lighthouse";
}

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const config = require('./custom-config');
const argv = require('yargs').argv;
const url = require('url');
const fs = require('fs');

const launchChromeAndRunLighthouse = (url) => {
  return chromeLauncher.launch({ chromeFlags: ['--headless'] }).then((chrome) => {
    return lighthouse(url, { port: chrome.port }, config).then((results) => {
      return chrome.kill().then(() => results.lhr);
    });
  });
};

if (argv.url) {
  const urlObj = new URL(argv.url);

  let fileName = urlObj.pathname.replace(/\//g, '_').replace('.html', '.json');
  let filePath = `./results/${fileName}`;

  if (!fs.existsSync(filePath)) {
    const initJSON = { page: argv.url, data: [] };

    fs.writeFile(filePath, JSON.stringify(initJSON), (err) => {
      if (err) throw err;
    });
  }

  launchChromeAndRunLighthouse(argv.url).then((results) => {
    const report = require(filePath);
    const newReportData = {
      timestamp: results.fetchTime,
      executionTime: results.audits['custom-audit'].numericValue,
      tbt: results.audits['total-blocking-time'].numericValue,
      domSize: results.audits['dom-size'].numericValue,
    };
    report.data.push(newReportData);

    fs.writeFile(filePath, JSON.stringify(report), (err) => {
      if (err) throw err;
    });
  });
} else {
  throw "You haven't passed a URL to Lighthouse";
}

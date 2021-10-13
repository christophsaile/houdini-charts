const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

(async () => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port,
  };
  const runnerResult = await lighthouse(
    'https://houdini-charts.netlify.app/04-highcharts/highcharts-line-chart.html',
    options
  );

  // `.report` is the HTML report as a string
  // const reportHtml = runnerResult.report;
  const report = require('./report.json');
  const newObj = { url: runnerResult.lhr.finalUrl };
  report.data.push(newObj);
  console.log(runnerResult.lhr);

  fs.writeFileSync('./report.json', JSON.stringify(report));

  // `.lhr` is the Lighthouse Result as a JS object
  // console.log('Report is done for', runnerResult.lhr.finalUrl);
  // console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);
  // console.log(runnerResult.lhr.categories.performance);

  await chrome.kill();
})();

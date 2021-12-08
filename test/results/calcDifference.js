const fs = require('fs');
const argv = require('yargs').argv;

if (argv.path) {
  const path = argv.path;
  const result = require(`./${path}/results-${path}.json`);

  const filter = Object.values(result).map((elem, index) => {
    return Object.values(elem).map((elem, index) => {
      return elem.executionTime.average;
    });
  });
  const arrayChartjs = [];
  const arrayHighcharts = [];

  for (let i = 0, n = 4; i < n; i++) {
    let chartjs = Math.round((filter[0][i] / filter[1][i]) * 100 * 100) / 100;
    chartjs <= 100 ? (chartjs = `-${100 - chartjs}%`) : (chartjs = `+${chartjs - 100}%`);
    arrayChartjs.push(chartjs);
    let highcharts = Math.round((filter[0][i] / filter[2][i]) * 100 * 100) / 100;
    highcharts <= 100
      ? (highcharts = `-${100 - highcharts}%`)
      : (highcharts = `+${highcharts - 100}%`);
    arrayHighcharts.push(highcharts);
  }

  const results = {
    chartjs: arrayChartjs,
    highcharts: arrayHighcharts,
  };

  fs.writeFile(`./difference-${path}.json`, JSON.stringify(results), (err) => {
    if (err) throw err;
  });
} else {
  throw "You haven't passed a path";
}

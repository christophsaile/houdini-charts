const fs = require('fs');
const argv = require('yargs').argv;

if (argv.path) {
  const path = argv.path;
  const houdiniLineChartMin = require(`./${path}/_01-houdinicharts_line-chart-min.json`).data;
  const houdiniLineChart = require(`./${path}/_01-houdinicharts_line-chart.json`).data;
  const houdiniRadarChartMin = require(`./${path}/_01-houdinicharts_radar-chart-min.json`).data;
  const houdiniRadarChart = require(`./${path}/_01-houdinicharts_radar-chart.json`).data;

  const chartjsLineChartMin = require(`./${path}/_02-chartjs_line-chart-min.json`).data;
  const chartjsLineChart = require(`./${path}/_02-chartjs_line-chart.json`).data;
  const chartjsRadarChartMin = require(`./${path}/_02-chartjs_radar-chart-min.json`).data;
  const chartjsRadarChart = require(`./${path}/_02-chartjs_radar-chart.json`).data;

  const highchartsLineChartMin = require(`./${path}/_03-highcharts_line-chart-min.json`).data;
  const highchartsLineChart = require(`./${path}/_03-highcharts_line-chart.json`).data;
  const highchartsRadarChartMin = require(`./${path}/_03-highcharts_radar-chart-min.json`).data;
  const highchartsRadarChart = require(`./${path}/_03-highcharts_radar-chart.json`).data;

  const flattenMapExec = (data) =>
    data.map((elem) => {
      return elem.executionTime;
    });
  const flattenMapTbt = (data) =>
    data.map((elem) => {
      return elem.tbt;
    });

  const calcAverage = (list) => list.reduce((prev, curr) => prev + curr) / list.length;
  const calcHighest = (list) => Math.max(...list);
  const calcLowest = (list) => Math.min(...list);

  const Houdini = {
    lineChart: {
      executionTime: {
        average: calcAverage(flattenMapExec(houdiniLineChart)),
        max: calcHighest(flattenMapExec(houdiniLineChart)),
        min: calcLowest(flattenMapExec(houdiniLineChart)),
      },
      tbt: {
        average: calcAverage(flattenMapTbt(houdiniLineChart)),
        max: calcHighest(flattenMapTbt(houdiniLineChart)),
        min: calcLowest(flattenMapTbt(houdiniLineChart)),
      },
      domSize: houdiniLineChart[0].domSize,
    },
    lineChartMin: {
      executionTime: {
        average: calcAverage(flattenMapExec(houdiniLineChartMin)),
        max: calcHighest(flattenMapExec(houdiniLineChartMin)),
        min: calcLowest(flattenMapExec(houdiniLineChartMin)),
      },
      tbt: {
        average: calcAverage(flattenMapTbt(houdiniLineChartMin)),
        max: calcHighest(flattenMapTbt(houdiniLineChartMin)),
        min: calcLowest(flattenMapTbt(houdiniLineChartMin)),
      },
      domSize: houdiniLineChartMin[0].domSize,
    },
    radarChart: {
      executionTime: {
        average: calcAverage(flattenMapExec(houdiniRadarChart)),
        max: calcHighest(flattenMapExec(houdiniRadarChart)),
        min: calcLowest(flattenMapExec(houdiniRadarChart)),
      },
      tbt: {
        average: calcAverage(flattenMapTbt(houdiniRadarChart)),
        max: calcHighest(flattenMapTbt(houdiniRadarChart)),
        min: calcLowest(flattenMapTbt(houdiniRadarChart)),
      },
      domSize: houdiniRadarChart[0].domSize,
    },
    radarChartMin: {
      executionTime: {
        average: calcAverage(flattenMapExec(houdiniRadarChartMin)),
        max: calcHighest(flattenMapExec(houdiniRadarChartMin)),
        min: calcLowest(flattenMapExec(houdiniRadarChartMin)),
      },
      tbt: {
        average: calcAverage(flattenMapTbt(houdiniRadarChartMin)),
        max: calcHighest(flattenMapTbt(houdiniRadarChartMin)),
        min: calcLowest(flattenMapTbt(houdiniRadarChartMin)),
      },
      domSize: houdiniRadarChartMin[0].domSize,
    },
  };

  const Chartjs = {
    lineChart: {
      executionTime: {
        average: calcAverage(flattenMapExec(chartjsLineChart)),
        max: calcHighest(flattenMapExec(chartjsLineChart)),
        min: calcLowest(flattenMapExec(chartjsLineChart)),
      },
      tbt: {
        average: calcAverage(flattenMapTbt(chartjsLineChart)),
        max: calcHighest(flattenMapTbt(chartjsLineChart)),
        min: calcLowest(flattenMapTbt(chartjsLineChart)),
      },
      domSize: chartjsLineChart[0].domSize,
    },
    lineChartMin: {
      executionTime: {
        average: calcAverage(flattenMapExec(chartjsLineChartMin)),
        max: calcHighest(flattenMapExec(chartjsLineChartMin)),
        min: calcLowest(flattenMapExec(chartjsLineChartMin)),
      },
      tbt: {
        average: calcAverage(flattenMapTbt(chartjsLineChartMin)),
        max: calcHighest(flattenMapTbt(chartjsLineChartMin)),
        min: calcLowest(flattenMapTbt(chartjsLineChartMin)),
      },
      domSize: chartjsLineChartMin[0].domSize,
    },
    radarChart: {
      executionTime: {
        average: calcAverage(flattenMapExec(chartjsRadarChart)),
        max: calcHighest(flattenMapExec(chartjsRadarChart)),
        min: calcLowest(flattenMapExec(chartjsRadarChart)),
      },
      tbt: {
        average: calcAverage(flattenMapTbt(chartjsRadarChart)),
        max: calcHighest(flattenMapTbt(chartjsRadarChart)),
        min: calcLowest(flattenMapTbt(chartjsRadarChart)),
      },
      domSize: chartjsRadarChart[0].domSize,
    },
    radarChartMin: {
      executionTime: {
        average: calcAverage(flattenMapExec(chartjsRadarChartMin)),
        max: calcHighest(flattenMapExec(chartjsRadarChartMin)),
        min: calcLowest(flattenMapExec(chartjsRadarChartMin)),
      },
      tbt: {
        average: calcAverage(flattenMapTbt(chartjsRadarChartMin)),
        max: calcHighest(flattenMapTbt(chartjsRadarChartMin)),
        min: calcLowest(flattenMapTbt(chartjsRadarChartMin)),
      },
      domSize: chartjsRadarChartMin[0].domSize,
    },
  };

  const Highcharts = {
    lineChart: {
      executionTime: {
        average: calcAverage(flattenMapExec(highchartsLineChart)),
        max: calcHighest(flattenMapExec(highchartsLineChart)),
        min: calcLowest(flattenMapExec(highchartsLineChart)),
      },
      tbt: {
        average: calcAverage(flattenMapTbt(highchartsLineChart)),
        max: calcHighest(flattenMapTbt(highchartsLineChart)),
        min: calcLowest(flattenMapTbt(highchartsLineChart)),
      },
      domSize: highchartsLineChart[0].domSize,
    },
    lineChartMin: {
      executionTime: {
        average: calcAverage(flattenMapExec(highchartsLineChartMin)),
        max: calcHighest(flattenMapExec(highchartsLineChartMin)),
        min: calcLowest(flattenMapExec(highchartsLineChartMin)),
      },
      tbt: {
        average: calcAverage(flattenMapTbt(highchartsLineChartMin)),
        max: calcHighest(flattenMapTbt(highchartsLineChartMin)),
        min: calcLowest(flattenMapTbt(highchartsLineChartMin)),
      },
      domSize: highchartsLineChartMin[0].domSize,
    },
    radarChart: {
      executionTime: {
        average: calcAverage(flattenMapExec(highchartsRadarChart)),
        max: calcHighest(flattenMapExec(highchartsRadarChart)),
        min: calcLowest(flattenMapExec(highchartsRadarChart)),
      },
      tbt: {
        average: calcAverage(flattenMapTbt(highchartsRadarChart)),
        max: calcHighest(flattenMapTbt(highchartsRadarChart)),
        min: calcLowest(flattenMapTbt(highchartsRadarChart)),
      },
      domSize: highchartsRadarChart[0].domSize,
    },
    radarChartMin: {
      executionTime: {
        average: calcAverage(flattenMapExec(highchartsRadarChartMin)),
        max: calcHighest(flattenMapExec(highchartsRadarChartMin)),
        min: calcLowest(flattenMapExec(highchartsRadarChartMin)),
      },
      tbt: {
        average: calcAverage(flattenMapTbt(highchartsRadarChartMin)),
        max: calcHighest(flattenMapTbt(highchartsRadarChartMin)),
        min: calcLowest(flattenMapTbt(highchartsRadarChartMin)),
      },
      domSize: highchartsRadarChartMin[0].domSize,
    },
  };

  const results = {
    houdini: Houdini,
    chartjs: Chartjs,
    highcharts: Highcharts,
  };

  fs.writeFile(`./results-${path}.json`, JSON.stringify(results), (err) => {
    if (err) throw err;
  });
} else {
  throw "You haven't passed a path";
}

const houdiniLineChartMin = require('./_01-houdinicharts_line-chart-min.json').data;
const houdiniLineChart = require('./_01-houdinicharts_line-chart.json').data;
const houdiniRadarChartMin = require('./_01-houdinicharts_radar-chart-min.json').data;
const houdiniRadarChart = require('./_01-houdinicharts_radar-chart.json').data;

const chartjsLineChartMin = require('./_02-chartjs_line-chart-min.json').data;
const chartjsLineChart = require('./_02-chartjs_line-chart.json').data;
const chartjsRadarChartMin = require('./_02-chartjs_radar-chart-min.json').data;
const chartjsRadarChart = require('./_02-chartjs_radar-chart.json').data;

const highchartsLineChartMin = require('./_03-highcharts_line-chart-min.json').data;
const highchartsLineChart = require('./_03-highcharts_line-chart.json').data;
const highchartsRadarChartMin = require('./_03-highcharts_radar-chart-min.json').data;
const highchartsRadarChart = require('./_03-highcharts_radar-chart.json').data;

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
    domeSize: houdiniLineChart[0].domSize,
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
    domeSize: houdiniLineChartMin[0].domSize,
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
    domeSize: houdiniRadarChart[0].domSize,
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
    domeSize: houdiniRadarChartMin[0].domSize,
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
    domeSize: chartjsLineChart[0].domSize,
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
    domeSize: chartjsLineChartMin[0].domSize,
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
    domeSize: chartjsRadarChart[0].domSize,
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
    domeSize: chartjsRadarChartMin[0].domSize,
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
    domeSize: highchartsLineChart[0].domSize,
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
    domeSize: highchartsLineChartMin[0].domSize,
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
    domeSize: highchartsRadarChart[0].domSize,
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
    domeSize: highchartsRadarChartMin[0].domSize,
  },
};

console.log('Houdini', Houdini);
console.log('Chartjs', Chartjs);
console.log('Highcharts', Highcharts);

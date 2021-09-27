export function getChartSize(chart: HTMLElement, searchString: string) {
  const size = {
    height: chart.querySelector(searchString)?.clientHeight,
    width: chart.querySelector(searchString)?.clientWidth,
  };
  return size;
}

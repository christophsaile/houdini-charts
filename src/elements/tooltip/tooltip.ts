// styles
import './tooltip.css';

// interfaces
import { coordinates } from '../../utils/utils';

// worklets
const tooltipWorklet = new URL('../../worklets/tooltip.js', import.meta.url);
// @ts-ignore
CSS.paintWorklet.addModule(tooltipWorklet.href);

export function Tooltip(
  label: string,
  dataset: string,
  value: number,
  color: string,
  position: coordinates
): string {
  return `<div class='houdini__tooltip houdini__tooltip--hide'><p class='houdini__headline'></p><p class='houdini__subline'></p></div>`;
}

export function updateTooltip(event: MouseEvent, chart: HTMLElement) {
  const tooltip = chart.querySelector('.houdini__tooltip')!;
  tooltip.classList.remove('houdini__tooltip--hide');

  const position = {
    // @ts-ignore
    x: event.target.attributeStyleMap.get('left').value + 5,
    // @ts-ignore
    y: event.target.attributeStyleMap.get('bottom').value + 5,
  };
  const dataset = (event.target as HTMLElement).getAttribute('dataset');
  const label = (event.target as HTMLElement).getAttribute('data-x') || '';
  const value = (event.target as HTMLElement).getAttribute('data-y') || '';
  // @ts-ignore
  const color = event.target.attributeStyleMap.get('background-color').toString();

  tooltip.firstElementChild!.innerHTML = label;
  tooltip.lastElementChild!.innerHTML = `<span style='background-color:${color};'></span>${dataset}: ${value}`;

  const tooltipWidth = tooltip.clientWidth / 4;
  const tooltipHeight = tooltip.clientHeight / 2;

  // @ts-ignore
  tooltip.attributeStyleMap.set('left', CSS.px(position.x - tooltipWidth));
  // @ts-ignore
  tooltip.attributeStyleMap.set('bottom', CSS.px(position.y + tooltipHeight));
}

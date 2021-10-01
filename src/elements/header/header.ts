// styles
import './header.css';

// Interfaces
import { Config } from '../../config';

export function Header(config: Config): string {
  const title = config.title;
  const legend = config.options?.legend;

  const renderLegend = () => {
    return `
      <ul class='houdini__legend'>
        ${config.data.datasets
          .map(
            (elem) =>
              `<li data-set='${elem.name}'class='houdini__legend-item'><span style='background-color: ${elem.color}'></span><p>${elem.name}</p></li>`
          )
          .join('')}
      </ul>
    `;
  };

  return `
    <section class='houdini__header'>
      <h2 class='houdini__title'>${title}</h2>
      ${legend ? renderLegend() : ''}
    </section>
  `;
}

export function headerEvents(root: HTMLElement) {
  const legendItems: HTMLElement[] = [].slice.call(root.querySelectorAll('.houdini__legend-item'));
  if (legendItems) {
    legendItems.forEach((elem) => {
      elem.addEventListener('click', () => {
        const attribute = elem.getAttribute('data-set');
        const dataset = root.querySelector('#' + attribute);
        dataset?.classList.toggle('houdini__dataset--hide');
      });
    });
  }
}

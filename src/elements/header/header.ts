// styles
import './header.css';

// Interfaces
import { Config } from '../../config';

export default function Header(config: Config): string {
  const title = config.title;
  const legend = config.options?.legend;

  const renderLegend = () => {
    return `
      <section class='houdini__legend'>
        ${config.data.datasets
          .map(
            (elem) =>
              `<div data-set='${elem.name}'class='houdini__legend-item'><span style='background-color: ${elem.color}'></span><p>${elem.name}</p></div>`
          )
          .join('')}
      </section>
    `;
  };

  return `
    <section class='houdini__header'>
      <h2 class='houdini__title'>${title}</h2>
      ${legend ? renderLegend() : ''}
    </section>
  `;
}

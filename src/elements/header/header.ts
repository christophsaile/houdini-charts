// styles
import './header.css';

// Interfaces
import { Config } from '../../config';

export default function Header(config: Config): string {
  const title = config.title;
  const legend = config.options?.legend;

  return `
    ${title}
    ${legend ? 'legend' : 'nolegend'}
    `;
}

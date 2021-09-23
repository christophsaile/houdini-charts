// styles
import './header.css';

// Interfaces
import Legend from './header';

class header {
  constructor(private readonly title: string, private readonly legend?: Legend) {}
}
export default header;

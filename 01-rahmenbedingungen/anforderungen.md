## Anforderungen an das Projekt

- Tablle kann über JSON-File angepasst werden. Das beinhaltet:

```TypeScript
interface Config {
  labels: {
    titel: string;
    xAxe: string;
    yAxe: string;
  };
  axes: {
    xAxe: Axe;
    yAxe: Axe;
  };
  datasets: Dataset[];
}

interface Axe {
  auto: boolean;
  min: number | undefined;
  max: number | undefined;
}

interface Dataset {
  label: string;
  data: number;
}
```

- Datensätze können per Klick markiert werden.
- Ein Diagramm kann mehrer Datensätze enthalten. Über einen Reiter kann zwischen den einzelnen Diagrammen gewechselt werden.

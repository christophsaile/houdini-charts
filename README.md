# Prototypische Entwicklung von interaktiven und performanten Web-Komponenten zur Datenvisualisierung mit CSS Houdini

[![Netlify Status](https://api.netlify.com/api/v1/badges/30706b50-044a-420f-aec8-9da828fcced3/deploy-status)](https://app.netlify.com/sites/houdini-charts/deploys)

## Getting Started

```
npm install
```

### Serve

```
npm start
```

### Build

```
npm run build
```

### Test

```
cd ./test

npm run houdini line
node multiple-tests.js --runs <number> --url <url>
node index.js --url <url>
```

Tests auswerten

```
cd ./test/results

node calcResults.js --path <pathToFolderWithResults>
node calcDifference.js --path <pathToFolderWithResults>
```

## Projekt Struktur

### public

Entählt alle Daten die nicht von Webpack gebundelt werden.
Aktuell sind das die folgenden Dateien:

- .html
- mock-data
- test libraries

### src

Entählt alle Daten die von Webpack gebundelt werden.
Aktuell sind das die folgenden Dateien:

- .css
- .ts
- .js

Worklets werden als .js Datei gespeichert, da einige Methoden noch nicht von TypeScript unterstützt werden (registerProperty ...)

### test

Enthält Scripte zum ausführen von automatisierten Tests.

## Live APIs

- https://api.corona-zahlen.org/germany/history/cases/7
- https://api.corona-zahlen.org/germany/history/cases
- https://api.corona-zahlen.org/germany/age-groups
- https://api.corona-zahlen.org/states/age-groups

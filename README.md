# Prototypische Entwicklung von interaktiven und performanten Web-Komponenten zur Datenvisualisierung mit CSS Houdini

[![Netlify Status](https://api.netlify.com/api/v1/badges/30706b50-044a-420f-aec8-9da828fcced3/deploy-status)](https://app.netlify.com/sites/houdini-charts/deploys)

## Projekt Struktur

### mock

Enthält Dateien um die Anwendung mit Testdaten zu füllen.

### public

Entählt alle Daten die nicht von Webpack gebundelt werden.
Aktuell sind das die folgenden Dateien:

- .html

### src

Entählt alle Daten die von Webpack gebundelt werden.
Aktuell sind das die folgenden Dateien:

- .css
- .ts
- .js

Worklets werden als .js Datei gespeichert, da einige Methoden noch nicht von TypeScript unterstützt werden (registerProperty ...)

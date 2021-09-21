# 1. Hinfürhung zum Thema

## Ausgangssituation

Aktuell zwei etablierte herangehensweisen zur Datenvisualisierung -> SVG, Canvas

Beide Technologien haben Schwächen:

- SVG -> Großer DOM -> Performance
- Canvas -> Keine direkte Interaktion mit Elementen
- Accessibility

## Zielsetzung

Mithilfe von CSS Houdini soll eine Library entwickelt werden, welche die Schwächen der bereits etablierten Technologien beseitigt.

## Problemdarstellung und Fragestellung

Inwiefern lassen sich mit CSS Houdini performante und interaktive Web-Komponenten zur Datenvisualisierung erstellen?

# 2. Theoretische Grundlagen

## Browser Rendering Engine

_Grundlagen erklären wie Browser Rendering Engine funktioniert?_

## CSS Houdini

Grundladen der Browser Rendering Engine aufgreifen und erläutern wie CSS Houdini darauf Einfluss hat. Anschließend auf die verwendeten APIs eingehen.

- Worklets
- Paint API
- Properties and Values API
- Typed Object Model
- Animation Worklet?

## (SVG?)

_Grundlagen erklären was SVG ist und wie es funktioniert? sinnvoll?_

## (Canvas?)

_Grundlagen erklären was Canvas ist und wie es funktioniert? sinnvoll?_

## (TypeScript?)

_Grundlagen erklären was TypeScript ist und wie es funktioniert? sinnvoll?_

## (WebPack?)

_Grundlagen erklären was WebPack ist? sinnvoll?_

# 3. Analyse vorhandener Chart Librarys

_Inwiefern muss Auswahl begründet werden?, reicht Aussage, dass eine Library gewählt wurde welche auf svg basiert und eine auf Canvas oder muss begründet werden warum Highcharts.js/Apexcharts.js/D3.js?_

## Highcharts/Apex/D3

Library und deren Grundprinzipien kurz vorstellen.
(basiert auf SVG)

## Charts.js

Library und deren Grundprinzipien kurz vorstellen.
(basiert auf Canvas)

# 4. Umsetzung der Anwendung

## Entwicklungsumgebung

Wie ist das Projekt aufgebaut? Technologien

## Anforderungen/Features

Features der Library aufzählen

## Beschreibung der Umsetzung

Projektstruktur (Barrel-System)

## Herausforderungen

Welche Herausforderungen traten bei der Entwicklung der Anwendung auf?

# 5. Evaluierung

Evaluierung der Anwendung anhand eines Kriterienkataloges im Vergleich zu zwei bereits etablierten Library zur Datenvisualisierung

## Kriterienkatalog:

- Performance
- Interaktivität
- _(Accessibility?)_

# 6. Fazit und Ausblick

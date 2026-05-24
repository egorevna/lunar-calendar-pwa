# DEGREE_RULERS_TABLE_7_TOME2_CROSS_REFERENCE.md

## Purpose

This document is a textual cross-reference for Table 7 using Vronsky Tome 2.

It is not:

- an active dataset;
- a lookup engine;
- UI;
- an interpretation layer.

It cross-references Table 7 draft rows against Tome 2 degree-ruler lines only.

## Source

- Table 7 image: `table7.jpg`;
- Draft: `DEGREE_RULERS_TABLE_7_TRANSCRIPTION_DRAFT.md`;
- Verification report: `DEGREE_RULERS_TABLE_7_VERIFICATION_REPORT.md`;
- Tome 2: `Вронский, Том 2 — Градусология`;
- Source system: Vronsky degree rulers.

## Extraction Rule

Only extract `Управитель` / `Управители` lines for each sign degree.

Do not extract:

- interpretation text;
- fixed star text;
- `При повреждении` text;
- historical examples;
- five-degree ranges;
- decans;
- sign descriptions.

## Ruler Token Mapping

Allowed ruler keys/names:

- `sun` / Sun / Солнце;
- `moon` / Moon / Луна;
- `mercury` / Mercury / Меркурий;
- `venus` / Venus / Венера;
- `mars` / Mars / Марс;
- `jupiter` / Jupiter / Юпитер;
- `saturn` / Saturn / Сатурн;
- `uranus` / Uranus / Уран;
- `neptune` / Neptune / Нептун;
- `pluto` / Pluto / Плутон;
- `chiron` / Chiron / Хирон;
- `proserpina` / Proserpina / Прозерпина.

Retrograde:

- `ретроградный` / `ретроградная` means `retrograde: true` for that ruler;
- `ретроградные` before a coordinated ruler pair means `retrograde: true` for both rulers in that pair;
- do not apply retrograde to another ruler unless Tome 2 explicitly says it.

## Important Glyph Clarifications

- node-like glyph in Table 7 unclear rows resolves as Chiron / Хирон when Tome 2 says `Хирон`.
- Gemini-like glyph in Table 7 unclear rows resolves as Proserpina / Прозерпина when Tome 2 says `Прозерпина`.
- retrograde marker is assigned by Tome 2 text, not by blind visual replacement.

Known careful checks:

- Gemini / Близнецы degree 0: Tome 2 says `Управители ретроградный Меркурий и Прозерпина`; Proserpina is not retrograde.
- Gemini / Близнецы degree 14: Tome 2 says `Управители ретроградный Меркурий и Прозерпина`; Proserpina is not retrograde.
- Gemini / Близнецы degrees 7, 21 and 28 use `ретроградные Меркурий и Прозерпина`; both rulers are retrograde there.

## Cross-Reference Rows

## Aries / Овен

| Degree | Tome 2 Ruler Line | Parsed Rulers | Draft Before | Cross-Check | Notes |
|---:|---|---|---|---|---|
| 0 | Управители Марс и ретроградный Плутон | Mars / Марс; Pluto R / Плутон R | Mars; Pluto R => Mars / Марс; Pluto R / Плутон R | match |  |
| 1 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 2 | Управители Венера и ретроградный Хирон | Venus / Венера; Chiron R / Хирон R | Venus; node-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 3 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 4 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 5 | Управители Сатурн и ретроградный Уран | Saturn / Сатурн; Uranus R / Уран R | Saturn; Uranus R => Saturn / Сатурн; Uranus R / Уран R | match |  |
| 6 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 7 | Управители Марс и ретроградный Плутон | Mars / Марс; Pluto R / Плутон R | Mars; Pluto R => Mars / Марс; Pluto R / Плутон R | match |  |
| 8 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 9 | Управители Венера и ретроградный Хирон | Venus / Венера; Chiron R / Хирон R | Venus; node-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 10 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 11 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 12 | Управители Сатурн и ретроградный Уран | Saturn / Сатурн; Uranus R / Уран R | Saturn; Uranus R => Saturn / Сатурн; Uranus R / Уран R | match |  |
| 13 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 14 | Управители Марс и ретроградный Плутон | Mars / Марс; Pluto R / Плутон R | Mars; Pluto R => Mars / Марс; Pluto R / Плутон R | match |  |
| 15 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 16 | Управители Венера и ретроградный Хирон | Venus / Венера; Chiron R / Хирон R | Venus; node-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 17 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 18 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 19 | Управители Сатурн и ретроградный Уран | Saturn / Сатурн; Uranus R / Уран R | Saturn; Uranus R => Saturn / Сатурн; Uranus R / Уран R | match |  |
| 20 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 21 | Управители Марс и ретроградный Плутон | Mars / Марс; Pluto R / Плутон R | Mars; Pluto R => Mars / Марс; Pluto R / Плутон R | match |  |
| 22 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 23 | Управители Венера и ретроградный Хирон | Venus / Венера; Chiron R / Хирон R | Venus; node-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 24 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 25 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 26 | Управители Сатурн и ретроградный Уран | Saturn / Сатурн; Uranus R / Уран R | Saturn; Uranus R => Saturn / Сатурн; Uranus R / Уран R | match |  |
| 27 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 28 | Управители Марс и ретроградный Плутон | Mars / Марс; Pluto R / Плутон R | Mars; Pluto R => Mars / Марс; Pluto R / Плутон R | match |  |
| 29 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |

## Taurus / Телец

| Degree | Tome 2 Ruler Line | Parsed Rulers | Draft Before | Cross-Check | Notes |
|---:|---|---|---|---|---|
| 0 | Управители Хирон и ретроградная Венера | Chiron / Хирон; Venus R / Венера R | Uranus; Venus R => Uranus / Уран; Venus R / Венера R | resolved | Draft parsed ruler corrected via Tome 2 textual degree-ruler cross-reference. |
| 1 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 2 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 3 | Управители Уран и ретроградный Сатурн | Uranus / Уран; Saturn R / Сатурн R | Uranus; Saturn R => Uranus / Уран; Saturn R / Сатурн R | match |  |
| 4 | Управители Юпитер и Нептун | Jupiter / Юпитер; Neptune / Нептун | Jupiter; Neptune => Jupiter / Юпитер; Neptune / Нептун | match |  |
| 5 | Управители Плутон и ретроградный Марс | Pluto / Плутон; Mars R / Марс R | Pluto; Mars R => Pluto / Плутон; Mars R / Марс R | match |  |
| 6 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 7 | Управители Хирон и ретроградная Венера | Chiron / Хирон; Venus R / Венера R | Uranus; Venus R => Uranus / Уран; Venus R / Венера R | resolved | Draft parsed ruler corrected via Tome 2 textual degree-ruler cross-reference. |
| 8 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 9 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 10 | Управители Уран и ретроградный Сатурн | Uranus / Уран; Saturn R / Сатурн R | Uranus; Saturn R => Uranus / Уран; Saturn R / Сатурн R | match |  |
| 11 | Управители Юпитер и Нептун | Jupiter / Юпитер; Neptune / Нептун | Jupiter; Neptune => Jupiter / Юпитер; Neptune / Нептун | match |  |
| 12 | Управители Плутон и ретроградный Марс | Pluto / Плутон; Mars R / Марс R | Pluto; Mars R => Pluto / Плутон; Mars R / Марс R | match |  |
| 13 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 14 | Управители Хирон и ретроградная Венера | Chiron / Хирон; Venus R / Венера R | Uranus; Venus R => Uranus / Уран; Venus R / Венера R | resolved | Draft parsed ruler corrected via Tome 2 textual degree-ruler cross-reference. |
| 15 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 16 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 17 | Управители Уран и ретроградный Сатурн | Uranus / Уран; Saturn R / Сатурн R | Uranus; Saturn R => Uranus / Уран; Saturn R / Сатурн R | match |  |
| 18 | Управители Юпитер и Нептун | Jupiter / Юпитер; Neptune / Нептун | Jupiter; Neptune => Jupiter / Юпитер; Neptune / Нептун | match |  |
| 19 | Управители Плутон и ретроградный Марс | Pluto / Плутон; Mars R / Марс R | Pluto; Mars R => Pluto / Плутон; Mars R / Марс R | match |  |
| 20 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 21 | Управители Хирон и ретроградная Венера | Chiron / Хирон; Venus R / Венера R | Uranus; Venus R => Uranus / Уран; Venus R / Венера R | resolved | Draft parsed ruler corrected via Tome 2 textual degree-ruler cross-reference. |
| 22 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 23 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 24 | Управители Уран и ретроградный Сатурн | Uranus / Уран; Saturn R / Сатурн R | Uranus; Saturn R => Uranus / Уран; Saturn R / Сатурн R | match |  |
| 25 | Управители Юпитер и Нептун | Jupiter / Юпитер; Neptune / Нептун | Jupiter; Neptune => Jupiter / Юпитер; Neptune / Нептун | match |  |
| 26 | Управители Плутон и ретроградный Марс | Pluto / Плутон; Mars R / Марс R | Pluto; Mars R => Pluto / Плутон; Mars R / Марс R | match |  |
| 27 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 28 | Управители Хирон и ретроградная Венера | Chiron / Хирон; Venus R / Венера R | Uranus; Venus R => Uranus / Уран; Venus R / Венера R | resolved | Draft parsed ruler corrected via Tome 2 textual degree-ruler cross-reference. |
| 29 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |

## Gemini / Близнецы

| Degree | Tome 2 Ruler Line | Parsed Rulers | Draft Before | Cross-Check | Notes |
|---:|---|---|---|---|---|
| 0 | Управители ретроградный Меркурий и Прозерпина | Mercury R / Меркурий R; Proserpina / Прозерпина | Mercury R; Gemini-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 1 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 2 | Управители Уран и Сатурн | Uranus / Уран; Saturn / Сатурн | Uranus; Saturn => Uranus / Уран; Saturn / Сатурн | match |  |
| 3 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 4 | Управители Марс и Плутон | Mars / Марс; Pluto / Плутон | Mars; Pluto => Mars / Марс; Pluto / Плутон | match |  |
| 5 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 6 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 7 | Управители ретроградные Меркурий и Прозерпина | Mercury R / Меркурий R; Proserpina R / Прозерпина R | Mercury R; Gemini-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 8 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 9 | Управители Уран и Сатурн | Uranus / Уран; Saturn / Сатурн | Uranus; Saturn => Uranus / Уран; Saturn / Сатурн | match |  |
| 10 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 11 | Управители Марс и Плутон | Mars / Марс; Pluto / Плутон | Mars; Pluto => Mars / Марс; Pluto / Плутон | match |  |
| 12 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 13 | Управители Хирон и Венера | Chiron / Хирон; Venus / Венера | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 14 | Управители ретроградный Меркурий и Прозерпина | Mercury R / Меркурий R; Proserpina / Прозерпина | Mercury R; Gemini-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 15 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 16 | Управители Уран и Сатурн | Uranus / Уран; Saturn / Сатурн | Uranus; Saturn => Uranus / Уран; Saturn / Сатурн | match |  |
| 17 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 18 | Управители Марс и Плутон | Mars / Марс; Pluto / Плутон | Mars; Pluto => Mars / Марс; Pluto / Плутон | match |  |
| 19 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 20 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 21 | Управители ретроградные Меркурий и Прозерпина | Mercury R / Меркурий R; Proserpina R / Прозерпина R | Mercury R; Gemini-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 22 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 23 | Управитель Сатурн | Saturn / Сатурн | Uranus; Saturn => Uranus / Уран; Saturn / Сатурн | resolved | Draft parsed ruler corrected via Tome 2 textual degree-ruler cross-reference. |
| 24 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 25 | Управители Марс и Плутон | Mars / Марс; Pluto / Плутон | Mars; Pluto => Mars / Марс; Pluto / Плутон | match |  |
| 26 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 27 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 28 | Управители ретроградные Меркурий и Прозерпина | Mercury R / Меркурий R; Proserpina R / Прозерпина R | Mercury R; Gemini-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 29 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |

## Cancer / Рак

| Degree | Tome 2 Ruler Line | Parsed Rulers | Draft Before | Cross-Check | Notes |
|---:|---|---|---|---|---|
| 0 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 1 | Управители Сатурн и ретроградный Уран | Saturn / Сатурн; Uranus R / Уран R | Saturn; Uranus R => Saturn / Сатурн; Uranus R / Уран R | match |  |
| 2 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 3 | Управители Марс и ретроградный Плутон | Mars / Марс; Pluto R / Плутон R | Mars; Pluto R => Mars / Марс; Pluto R / Плутон R | match |  |
| 4 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 5 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 6 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 7 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 8 | Управители Сатурн и ретроградный Уран | Saturn / Сатурн; Uranus R / Уран R | Saturn; Uranus R => Saturn / Сатурн; Uranus R / Уран R | match |  |
| 9 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 10 | Управители Марс и ретроградный Плутон | Mars / Марс; Pluto R / Плутон R | Mars; Pluto R => Mars / Марс; Pluto R / Плутон R | match |  |
| 11 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 12 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 13 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 14 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 15 | Управители Сатурн и ретроградный Уран | Saturn / Сатурн; Uranus R / Уран R | Saturn; Uranus R => Saturn / Сатурн; Uranus R / Уран R | match |  |
| 16 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 17 | Управители Марс и ретроградный Плутон | Mars / Марс; Pluto R / Плутон R | Mars; Pluto R => Mars / Марс; Pluto R / Плутон R | match |  |
| 18 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 19 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 20 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 21 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 22 | Управители Сатурн и ретроградный Уран | Saturn / Сатурн; Uranus R / Уран R | Saturn; Uranus R => Saturn / Сатурн; Uranus R / Уран R | match |  |
| 23 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 24 | Управители Марс и ретроградный Плутон | Mars / Марс; Pluto R / Плутон R | Mars; Pluto R => Mars / Марс; Pluto R / Плутон R | match |  |
| 25 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 26 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 27 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 28 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 29 | Управители Сатурн и ретроградный Уран | Saturn / Сатурн; Uranus R / Уран R | Saturn; Uranus R => Saturn / Сатурн; Uranus R / Уран R | match |  |

## Leo / Лев

| Degree | Tome 2 Ruler Line | Parsed Rulers | Draft Before | Cross-Check | Notes |
|---:|---|---|---|---|---|
| 0 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 1 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 2 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 3 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 4 | Управители Уран и ретроградный Сатурн | Uranus / Уран; Saturn R / Сатурн R | Uranus; Saturn R => Uranus / Уран; Saturn R / Сатурн R | match |  |
| 5 | Управители Нептун и ретроградный Юпитер | Neptune / Нептун; Jupiter R / Юпитер R | Neptune; Jupiter R => Neptune / Нептун; Jupiter R / Юпитер R | match |  |
| 6 | Управители Плутон и ретроградный Марс | Pluto / Плутон; Mars R / Марс R | Pluto; Mars R => Pluto / Плутон; Mars R / Марс R | match |  |
| 7 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 8 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 9 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 10 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 11 | Управители Уран и ретроградный Сатурн | Uranus / Уран; Saturn R / Сатурн R | Uranus; Saturn R => Uranus / Уран; Saturn R / Сатурн R | match |  |
| 12 | Управители Нептун и ретроградный Юпитер | Neptune / Нептун; Jupiter R / Юпитер R | Neptune; Jupiter R => Neptune / Нептун; Jupiter R / Юпитер R | match |  |
| 13 | Управители Плутон и ретроградный Марс | Pluto / Плутон; Mars R / Марс R | Pluto; Mars R => Pluto / Плутон; Mars R / Марс R | match |  |
| 14 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 15 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 16 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 17 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 18 | Управители Уран и ретроградный Сатурн | Uranus / Уран; Saturn R / Сатурн R | Uranus; Saturn R => Uranus / Уран; Saturn R / Сатурн R | match |  |
| 19 | Управители Нептун и ретроградный Юпитер | Neptune / Нептун; Jupiter R / Юпитер R | Neptune; Jupiter R => Neptune / Нептун; Jupiter R / Юпитер R | match |  |
| 20 | Управители Плутон и ретроградный Марс | Pluto / Плутон; Mars R / Марс R | Pluto; Mars R => Pluto / Плутон; Mars R / Марс R | match |  |
| 21 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 22 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 23 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 24 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 25 | Управители Уран и ретроградный Сатурн | Uranus / Уран; Saturn R / Сатурн R | Uranus; Saturn R => Uranus / Уран; Saturn R / Сатурн R | match |  |
| 26 | Управители Нептун и ретроградный Юпитер | Neptune / Нептун; Jupiter R / Юпитер R | Neptune; Jupiter R => Neptune / Нептун; Jupiter R / Юпитер R | match |  |
| 27 | Управители Плутон и ретроградный Марс | Pluto / Плутон; Mars R / Марс R | Pluto; Mars R => Pluto / Плутон; Mars R / Марс R | match |  |
| 28 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 29 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |

## Virgo / Дева

| Degree | Tome 2 Ruler Line | Parsed Rulers | Draft Before | Cross-Check | Notes |
|---:|---|---|---|---|---|
| 0 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 1 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 2 | Управители Сатурн и Уран | Saturn / Сатурн; Uranus / Уран | Saturn; Uranus => Saturn / Сатурн; Uranus / Уран | match |  |
| 3 | Управители Нептун и ретроградный Юпитер | Neptune / Нептун; Jupiter R / Юпитер R | Neptune; Jupiter R => Neptune / Нептун; Jupiter R / Юпитер R | match |  |
| 4 | Управители Марс и Плутон | Mars / Марс; Pluto / Плутон | Mars; Pluto => Mars / Марс; Pluto / Плутон | match |  |
| 5 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 6 | Управители Венера и ретроградный Хирон | Venus / Венера; Chiron R / Хирон R | Venus; node-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 7 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 8 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 9 | Управители Сатурн и Уран | Saturn / Сатурн; Uranus / Уран | Saturn; Uranus => Saturn / Сатурн; Uranus / Уран | match |  |
| 10 | Управители Нептун и ретроградный Юпитер | Neptune / Нептун; Jupiter R / Юпитер R | Neptune; Jupiter R => Neptune / Нептун; Jupiter R / Юпитер R | match |  |
| 11 | Управители Марс и Плутон | Mars / Марс; Pluto / Плутон | Mars; Pluto => Mars / Марс; Pluto / Плутон | match |  |
| 12 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 13 | Управители Венера и ретроградный Хирон | Venus / Венера; Chiron R / Хирон R | Venus; node-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 14 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 15 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 16 | Управители Сатурн и Уран | Saturn / Сатурн; Uranus / Уран | Saturn; Uranus => Saturn / Сатурн; Uranus / Уран | match |  |
| 17 | Управители Нептун и ретроградный Юпитер | Neptune / Нептун; Jupiter R / Юпитер R | Neptune; Jupiter R => Neptune / Нептун; Jupiter R / Юпитер R | match |  |
| 18 | Управители Марс и Плутон | Mars / Марс; Pluto / Плутон | Mars; Pluto => Mars / Марс; Pluto / Плутон | match |  |
| 19 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 20 | Управители Венера и ретроградный Хирон | Venus / Венера; Chiron R / Хирон R | Venus; node-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 21 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 22 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 23 | Управители Сатурн и Уран | Saturn / Сатурн; Uranus / Уран | Saturn; Uranus => Saturn / Сатурн; Uranus / Уран | match |  |
| 24 | Управители Нептун и ретроградный Юпитер | Neptune / Нептун; Jupiter R / Юпитер R | Neptune; Jupiter R => Neptune / Нептун; Jupiter R / Юпитер R | match |  |
| 25 | Управители Марс и Плутон | Mars / Марс; Pluto / Плутон | Mars; Pluto => Mars / Марс; Pluto / Плутон | match |  |
| 26 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 27 | Управители Венера и ретроградный Хирон | Venus / Венера; Chiron R / Хирон R | Venus; node-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 28 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 29 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |

## Libra / Весы

| Degree | Tome 2 Ruler Line | Parsed Rulers | Draft Before | Cross-Check | Notes |
|---:|---|---|---|---|---|
| 0 | Управители Венера и ретроградный Хирон | Venus / Венера; Chiron R / Хирон R | Venus; node-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 1 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 2 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 3 | Управители Сатурн и ретроградный Уран | Saturn / Сатурн; Uranus R / Уран R | Saturn; Uranus R => Saturn / Сатурн; Uranus R / Уран R | match |  |
| 4 | Управители Юпитер и Нептун | Jupiter / Юпитер; Neptune / Нептун | Jupiter; Neptune => Jupiter / Юпитер; Neptune / Нептун | match |  |
| 5 | Управители Марс и ретроградный Плутон | Mars / Марс; Pluto R / Плутон R | Mars; Pluto R => Mars / Марс; Pluto R / Плутон R | match |  |
| 6 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 7 | Управители Венера и ретроградный Хирон | Venus / Венера; Chiron R / Хирон R | Venus; node-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 8 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 9 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 10 | Управители Сатурн и ретроградный Уран | Saturn / Сатурн; Uranus R / Уран R | Saturn; Uranus R => Saturn / Сатурн; Uranus R / Уран R | match |  |
| 11 | Управители Юпитер и Нептун | Jupiter / Юпитер; Neptune / Нептун | Jupiter; Neptune => Jupiter / Юпитер; Neptune / Нептун | match |  |
| 12 | Управители Марс и ретроградный Плутон | Mars / Марс; Pluto R / Плутон R | Mars; Pluto R => Mars / Марс; Pluto R / Плутон R | match |  |
| 13 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 14 | Управители Венера и ретроградный Хирон | Venus / Венера; Chiron R / Хирон R | Venus; node-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 15 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 16 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 17 | Управители Сатурн и ретроградный Уран | Saturn / Сатурн; Uranus R / Уран R | Saturn; Uranus R => Saturn / Сатурн; Uranus R / Уран R | match |  |
| 18 | Управители Юпитер и Нептун | Jupiter / Юпитер; Neptune / Нептун | Jupiter; Neptune => Jupiter / Юпитер; Neptune / Нептун | match |  |
| 19 | Управители Марс и ретроградный Плутон | Mars / Марс; Pluto R / Плутон R | Mars; Pluto R => Mars / Марс; Pluto R / Плутон R | match |  |
| 20 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 21 | Управители Венера и ретроградный Хирон | Venus / Венера; Chiron R / Хирон R | Venus; node-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 22 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 23 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 24 | Управители Сатурн и ретроградный Уран | Saturn / Сатурн; Uranus R / Уран R | Saturn; Uranus R => Saturn / Сатурн; Uranus R / Уран R | match |  |
| 25 | Управители Юпитер и Нептун | Jupiter / Юпитер; Neptune / Нептун | Jupiter; Neptune => Jupiter / Юпитер; Neptune / Нептун | match |  |
| 26 | Управители Марс и ретроградный Плутон | Mars / Марс; Pluto R / Плутон R | Mars; Pluto R => Mars / Марс; Pluto R / Плутон R | match |  |
| 27 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 28 | Управители Венера и ретроградный Хирон | Venus / Венера; Chiron R / Хирон R | Venus; node-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 29 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |

## Scorpio / Скорпион

| Degree | Tome 2 Ruler Line | Parsed Rulers | Draft Before | Cross-Check | Notes |
|---:|---|---|---|---|---|
| 0 | Управители Плутон и ретроградный Марс | Pluto / Плутон; Mars R / Марс R | Pluto; Mars R => Pluto / Плутон; Mars R / Марс R | match |  |
| 1 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 2 | Управители Хирон и ретроградная Венера | Chiron / Хирон; Venus R / Венера R | node-like glyph; Venus R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 3 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 4 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 5 | Управители Уран и ретроградный Сатурн | Uranus / Уран; Saturn R / Сатурн R | Uranus; Saturn R => Uranus / Уран; Saturn R / Сатурн R | match |  |
| 6 | Управители Юпитер и Нептун | Jupiter / Юпитер; Neptune / Нептун | Jupiter; Neptune => Jupiter / Юпитер; Neptune / Нептун | match |  |
| 7 | Управители Плутон и ретроградный Марс | Pluto / Плутон; Mars R / Марс R | Pluto; Mars R => Pluto / Плутон; Mars R / Марс R | match |  |
| 8 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 9 | Управители Хирон и ретроградная Венера | Chiron / Хирон; Venus R / Венера R | node-like glyph; Venus R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 10 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 11 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 12 | Управители Уран и ретроградный Сатурн | Uranus / Уран; Saturn R / Сатурн R | Uranus; Saturn R => Uranus / Уран; Saturn R / Сатурн R | match |  |
| 13 | Управители Юпитер и Нептун | Jupiter / Юпитер; Neptune / Нептун | Jupiter; Neptune => Jupiter / Юпитер; Neptune / Нептун | match |  |
| 14 | Управители Плутон и ретроградный Марс | Pluto / Плутон; Mars R / Марс R | Pluto; Mars R => Pluto / Плутон; Mars R / Марс R | match |  |
| 15 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 16 | Управители Хирон и ретроградная Венера | Chiron / Хирон; Venus R / Венера R | node-like glyph; Venus R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 17 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 18 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 19 | Управители Уран и ретроградный Сатурн | Uranus / Уран; Saturn R / Сатурн R | Uranus; Saturn R => Uranus / Уран; Saturn R / Сатурн R | match |  |
| 20 | Управители Юпитер и Нептун | Jupiter / Юпитер; Neptune / Нептун | Jupiter; Neptune => Jupiter / Юпитер; Neptune / Нептун | match |  |
| 21 | Управители Плутон и ретроградный Марс | Pluto / Плутон; Mars R / Марс R | Pluto; Mars R => Pluto / Плутон; Mars R / Марс R | match |  |
| 22 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 23 | Управители Хирон и ретроградная Венера | Chiron / Хирон; Venus R / Венера R | node-like glyph; Venus R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 24 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 25 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 26 | Управители Уран и ретроградный Сатурн | Uranus / Уран; Saturn R / Сатурн R | Uranus; Saturn R => Uranus / Уран; Saturn R / Сатурн R | match |  |
| 27 | Управители Юпитер и Нептун | Jupiter / Юпитер; Neptune / Нептун | Jupiter; Neptune => Jupiter / Юпитер; Neptune / Нептун | match |  |
| 28 | Управители Плутон и ретроградный Марс | Pluto / Плутон; Mars R / Марс R | Pluto; Mars R => Pluto / Плутон; Mars R / Марс R | match |  |
| 29 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |

## Sagittarius / Стрелец

| Degree | Tome 2 Ruler Line | Parsed Rulers | Draft Before | Cross-Check | Notes |
|---:|---|---|---|---|---|
| 0 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 1 | Управители Марс и Плутон | Mars / Марс; Pluto / Плутон | Mars; Pluto => Mars / Марс; Pluto / Плутон | match |  |
| 2 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 3 | Управители Хирон и Венера | Chiron / Хирон; Venus / Венера | node-like glyph; Venus => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 4 | Управители ретроградные Меркурий и Прозерпина | Mercury R / Меркурий R; Proserpina R / Прозерпина R | Mercury R; Gemini-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 5 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 6 | Управители Сатурн и Уран | Saturn / Сатурн; Uranus / Уран | Saturn; Uranus => Saturn / Сатурн; Uranus / Уран | match |  |
| 7 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 8 | Управители Марс и Плутон | Mars / Марс; Pluto / Плутон | Mars; Pluto => Mars / Марс; Pluto / Плутон | match |  |
| 9 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 10 | Управители Хирон и Венера | Chiron / Хирон; Venus / Венера | node-like glyph; Venus => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 11 | Управители ретроградные Меркурий и Прозерпина | Mercury R / Меркурий R; Proserpina R / Прозерпина R | Mercury R; Gemini-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 12 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 13 | Управители Сатурн и Уран | Saturn / Сатурн; Uranus / Уран | Saturn; Uranus => Saturn / Сатурн; Uranus / Уран | match |  |
| 14 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 15 | Управители Марс и Плутон | Mars / Марс; Pluto / Плутон | Mars; Pluto => Mars / Марс; Pluto / Плутон | match |  |
| 16 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 17 | Управители Хирон и Венера | Chiron / Хирон; Venus / Венера | node-like glyph; Venus => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 18 | Управители ретроградные Меркурий и Прозерпина | Mercury R / Меркурий R; Proserpina R / Прозерпина R | Mercury R; Gemini-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 19 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 20 | Управители Сатурн и Уран | Saturn / Сатурн; Uranus / Уран | Saturn; Uranus => Saturn / Сатурн; Uranus / Уран | match |  |
| 21 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 22 | Управители Марс и Плутон | Mars / Марс; Pluto / Плутон | Mars; Pluto => Mars / Марс; Pluto / Плутон | match |  |
| 23 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 24 | Управители Хирон и Венера | Chiron / Хирон; Venus / Венера | node-like glyph; Venus => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 25 | Управители ретроградные Меркурий и Прозерпина | Mercury R / Меркурий R; Proserpina R / Прозерпина R | Mercury R; Gemini-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 26 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 27 | Управители Сатурн и Уран | Saturn / Сатурн; Uranus / Уран | Saturn; Uranus => Saturn / Сатурн; Uranus / Уран | match |  |
| 28 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 29 | Управители Марс и Плутон | Mars / Марс; Pluto / Плутон | Mars; Pluto => Mars / Марс; Pluto / Плутон | match |  |

## Capricorn / Козерог

| Degree | Tome 2 Ruler Line | Parsed Rulers | Draft Before | Cross-Check | Notes |
|---:|---|---|---|---|---|
| 0 | Управители Сатурн и ретроградный Уран | Saturn / Сатурн; Uranus R / Уран R | Saturn; Uranus R => Saturn / Сатурн; Uranus R / Уран R | match |  |
| 1 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 2 | Управители Марс и ретроградный Плутон | Mars / Марс; Pluto R / Плутон R | Mars; Pluto R => Mars / Марс; Pluto R / Плутон R | match |  |
| 3 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 4 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 5 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 6 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 7 | Управители Сатурн и ретроградный Уран | Saturn / Сатурн; Uranus R / Уран R | Saturn; Uranus R => Saturn / Сатурн; Uranus R / Уран R | match |  |
| 8 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 9 | Управители Марс и ретроградный Плутон | Mars / Марс; Pluto R / Плутон R | Mars; Pluto R => Mars / Марс; Pluto R / Плутон R | match |  |
| 10 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 11 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 12 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 13 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 14 | Управители Сатурн и ретроградный Уран | Saturn / Сатурн; Uranus R / Уран R | Saturn; Uranus R => Saturn / Сатурн; Uranus R / Уран R | match |  |
| 15 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 16 | Управители Марс и ретроградный Плутон | Mars / Марс; Pluto R / Плутон R | Mars; Pluto R => Mars / Марс; Pluto R / Плутон R | match |  |
| 17 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 18 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 19 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 20 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 21 | Управители Сатурн и ретроградный Уран | Saturn / Сатурн; Uranus R / Уран R | Saturn; Uranus R => Saturn / Сатурн; Uranus R / Уран R | match |  |
| 22 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |
| 23 | Управители Марс и ретроградный Плутон | Mars / Марс; Pluto R / Плутон R | Mars; Pluto R => Mars / Марс; Pluto R / Плутон R | match |  |
| 24 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 25 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 26 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 27 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 28 | Управители Сатурн и ретроградный Уран | Saturn / Сатурн; Uranus R / Уран R | Saturn; Uranus R => Saturn / Сатурн; Uranus R / Уран R | match |  |
| 29 | Управители Юпитер и ретроградный Нептун | Jupiter / Юпитер; Neptune R / Нептун R | Jupiter; Neptune R => Jupiter / Юпитер; Neptune R / Нептун R | match |  |

## Aquarius / Водолей

| Degree | Tome 2 Ruler Line | Parsed Rulers | Draft Before | Cross-Check | Notes |
|---:|---|---|---|---|---|
| 0 | Управители Уран и ретроградный Сатурн | Uranus / Уран; Saturn R / Сатурн R | Uranus; Saturn R => Uranus / Уран; Saturn R / Сатурн R | match |  |
| 1 | Управители Нептун и ретроградный Юпитер | Neptune / Нептун; Jupiter R / Юпитер R | Neptune; Jupiter R => Neptune / Нептун; Jupiter R / Юпитер R | match |  |
| 2 | Управители Плутон и ретроградный Марс | Pluto / Плутон; Mars R / Марс R | Pluto; Mars R => Pluto / Плутон; Mars R / Марс R | match |  |
| 3 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 4 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 5 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 6 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 7 | Управители Уран и ретроградный Сатурн | Uranus / Уран; Saturn R / Сатурн R | Uranus; Saturn R => Uranus / Уран; Saturn R / Сатурн R | match |  |
| 8 | Управители Нептун и ретроградный Юпитер | Neptune / Нептун; Jupiter R / Юпитер R | Neptune; Jupiter R => Neptune / Нептун; Jupiter R / Юпитер R | match |  |
| 9 | Управители Плутон и ретроградный Марс | Pluto / Плутон; Mars R / Марс R | Pluto; Mars R => Pluto / Плутон; Mars R / Марс R | match |  |
| 10 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 11 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 12 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 13 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 14 | Управители Уран и ретроградный Сатурн | Uranus / Уран; Saturn R / Сатурн R | Uranus; Saturn R => Uranus / Уран; Saturn R / Сатурн R | match |  |
| 15 | Управители Нептун и ретроградный Юпитер | Neptune / Нептун; Jupiter R / Юпитер R | Neptune; Jupiter R => Neptune / Нептун; Jupiter R / Юпитер R | match |  |
| 16 | Управители Плутон и ретроградный Марс | Pluto / Плутон; Mars R / Марс R | Pluto; Mars R => Pluto / Плутон; Mars R / Марс R | match |  |
| 17 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 18 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 19 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 20 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 21 | Управители Уран и ретроградный Сатурн | Uranus / Уран; Saturn R / Сатурн R | Uranus; Saturn R => Uranus / Уран; Saturn R / Сатурн R | match |  |
| 22 | Управители Нептун и ретроградный Юпитер | Neptune / Нептун; Jupiter R / Юпитер R | Neptune; Jupiter R => Neptune / Нептун; Jupiter R / Юпитер R | match |  |
| 23 | Управители Плутон и ретроградный Марс | Pluto / Плутон; Mars R / Марс R | Pluto; Mars R => Pluto / Плутон; Mars R / Марс R | match |  |
| 24 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 25 | Управители Венера и Хирон | Venus / Венера; Chiron / Хирон | Venus; node-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 26 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 27 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 28 | Управители Уран и ретроградный Сатурн | Uranus / Уран; Saturn R / Сатурн R | Uranus; Saturn R => Uranus / Уран; Saturn R / Сатурн R | match |  |
| 29 | Управители Нептун и ретроградный Юпитер | Neptune / Нептун; Jupiter R / Юпитер R | Neptune; Jupiter R => Neptune / Нептун; Jupiter R / Юпитер R | match |  |

## Pisces / Рыбы

| Degree | Tome 2 Ruler Line | Parsed Rulers | Draft Before | Cross-Check | Notes |
|---:|---|---|---|---|---|
| 0 | Управители Нептун и ретроградный Юпитер | Neptune / Нептун; Jupiter R / Юпитер R | Neptune; Jupiter R => Neptune / Нептун; Jupiter R / Юпитер R | match |  |
| 1 | Управители Марс и Плутон | Mars / Марс; Pluto / Плутон | Mars; Pluto => Mars / Марс; Pluto / Плутон | match |  |
| 2 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 3 | Управители Венера и ретроградный Хирон | Venus / Венера; Chiron R / Хирон R | Venus; node-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 4 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 5 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 6 | Управители Сатурн и Уран | Saturn / Сатурн; Uranus / Уран | Saturn; Uranus => Saturn / Сатурн; Uranus / Уран | match |  |
| 7 | Управители Нептун и ретроградный Юпитер | Neptune / Нептун; Jupiter R / Юпитер R | Neptune; Jupiter R => Neptune / Нептун; Jupiter R / Юпитер R | match |  |
| 8 | Управители Марс и Плутон | Mars / Марс; Pluto / Плутон | Mars; Pluto => Mars / Марс; Pluto / Плутон | match |  |
| 9 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 10 | Управители Венера и ретроградный Хирон | Venus / Венера; Chiron R / Хирон R | Venus; node-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 11 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 12 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 13 | Управители Сатурн и Уран | Saturn / Сатурн; Uranus / Уран | Saturn; Uranus => Saturn / Сатурн; Uranus / Уран | match |  |
| 14 | Управители Нептун и ретроградный Юпитер | Neptune / Нептун; Jupiter R / Юпитер R | Neptune; Jupiter R => Neptune / Нептун; Jupiter R / Юпитер R | match |  |
| 15 | Управители Марс и Плутон | Mars / Марс; Pluto / Плутон | Mars; Pluto => Mars / Марс; Pluto / Плутон | match |  |
| 16 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 17 | Управители Венера и ретроградный Хирон | Venus / Венера; Chiron R / Хирон R | Venus; node-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 18 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 19 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 20 | Управители Сатурн и Уран | Saturn / Сатурн; Uranus / Уран | Saturn; Uranus => Saturn / Сатурн; Uranus / Уран | match |  |
| 21 | Управители Нептун и ретроградный Юпитер | Neptune / Нептун; Jupiter R / Юпитер R | Neptune; Jupiter R => Neptune / Нептун; Jupiter R / Юпитер R | match |  |
| 22 | Управители Марс и Плутон | Mars / Марс; Pluto / Плутон | Mars; Pluto => Mars / Марс; Pluto / Плутон | match |  |
| 23 | Управитель Солнце | Sun / Солнце | Sun => Sun / Солнце | match |  |
| 24 | Управители Венера и ретроградный Хирон | Venus / Венера; Chiron R / Хирон R | Venus; node-like glyph R => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 25 | Управители Меркурий и Прозерпина | Mercury / Меркурий; Proserpina / Прозерпина | Mercury; Gemini-like glyph => unclear | resolved | Resolved via Tome 2 textual degree-ruler cross-reference. |
| 26 | Управитель Луна | Moon / Луна | Moon => Moon / Луна | match |  |
| 27 | Управители Сатурн и Уран | Saturn / Сатурн; Uranus / Уран | Saturn; Uranus => Saturn / Сатурн; Uranus / Уран | match |  |
| 28 | Управители Нептун и ретроградный Юпитер | Neptune / Нептун; Jupiter R / Юпитер R | Neptune; Jupiter R => Neptune / Нептун; Jupiter R / Юпитер R | match |  |
| 29 | Управители Марс и Плутон | Mars / Марс; Pluto / Плутон | Mars; Pluto => Mars / Марс; Pluto / Плутон | match |  |

## Summary

- total rows expected: 360;
- rows cross-referenced: 360;
- draft unclear before: 98;
- resolved unclear via Tome 2: 98;
- additional clear draft corrections via Tome 2: 6;
- total rows updated from Tome 2: 104;
- remaining unclear: 0;
- mismatch: 0.

## Decisions

- Tome 2 degree-ruler lines are authoritative for parsed Table 7 rulers.
- `table7.jpg` remains the visual source for Table 7 layout and source identity.
- Table 6 was not used.
- No active dataset was created.
- Next task may be Task 10.8e only because remaining unclear and mismatch counts are 0.

# ESSENTIAL_DIGNITY_FIXTURE_STRATEGY.md

## Purpose

This document fixes the Sprint 9 fixture strategy for validating the essential dignity lookup engine.

The fixture layer validates selected dignity flags, additive classical scores, modern outer-planet labels and summary counts.

It does not validate UI, display formatting, interpretations or future source packs.

## Fixture Principles

- Fixtures are deterministic and synthetic.
- Expected values are declared manually in fixture data.
- Expected values are not generated from `evaluateEssentialDignity()` or `evaluateEssentialDignities()`.
- Fixture input uses provider-style planet objects with planet key, label, sign and safe synthetic source metadata.
- Fixture validation checks the engine against the selected Sprint 9 source policy only.

## Fixture Categories

The Sprint 9 fixture set covers:

- domicile;
- detriment;
- exaltation;
- fall;
- multipleFlags;
- modernRulership;
- neutral;
- invalidPlanets;
- summary;
- strictExclusions.

## Synthetic Data Policy

Fixtures use synthetic planet sign placements only.

They do not use real natal charts, saved user profiles, private names, birth date, birth time, timezone, place data or coordinates.

Synthetic examples are intentionally obvious:

- Mars in Aries -> domicile;
- Mars in Libra -> detriment;
- Mercury in Virgo -> domicile and exaltation;
- Mercury in Pisces -> detriment and fall;
- Uranus in Aquarius -> modern rulership label only.

## Expected Values Policy

Expected dignity results are written directly in the fixture file.

They include:

- expected dignity flags;
- expected classical score;
- expected Russian labels;
- expected modern labels;
- expected summary counts when relevant.

The fixture file must not import the engine under test to build expected values.

## Validation Coverage

Fixture validation covers:

- all selected classical domicile signs;
- all selected classical detriment signs;
- all selected classical exaltation signs;
- all selected classical fall signs;
- additive overlap cases for Mercury in Virgo and Mercury in Pisces;
- modern outer-planet rulership labels for Uranus, Neptune and Pluto;
- neutral placements;
- invalid planet-like objects;
- mixed summary counts;
- output safety checks for private data and unsupported feature text.

## What Is Not Covered Yet

The fixture layer intentionally does not cover:

- terms / термы;
- decans / деканаты;
- degree rulers / управители градусов;
- Vronsky rows;
- exact exaltation degree scoring;
- fixed stars;
- houses / ASC / MC;
- transits;
- interpretations;
- ritual scoring.

These require separate source decisions and future dataset work.

## Decision Log

- Sprint 9 fixture validation uses synthetic/manual fixtures only.
- No private birth data, birth charts or user profiles are allowed in fixtures.
- Expected values are not generated from the engine under test.
- Fixtures validate dignity flags, scores, modern labels and summary only.
- Modern rulership remains label-only and score `0`.
- Vronsky tables, exact exaltation degrees, terms, decans and degree rulers remain deferred.

# ARABIC_PARTS_EXPANSION_SOURCE_POLICY.md

## Purpose

This document defines source gating for Sprint 15 Arabic Parts Expansion.

It prevents activating formulas without a verified source/tradition decision.

## Required Source Decision

Task 15.2 must decide:

1. Source corpus / tradition.
2. Formula conflict policy.
3. Candidate Lot verification method.
4. Day/night handling policy.
5. Whether formulas may depend on already calculated Lots.
6. Active/deferred criteria.

No source decision means no engine expansion.

## Candidate Lots

Candidate Lots for Sprint 15:

```txt
lot-of-eros
lot-of-necessity
lot-of-basis
lot-of-exaltation
```

All candidates start inactive until verified.

## Verification Statuses

Allowed statuses:

```txt
verified
candidate
deferred
needsReview
rejected
```

Only `verified` formulas may be active.

## Formula Row Requirements

Every active row must include:

- key;
- Russian label;
- English/Latin label;
- aliases if needed;
- active true;
- verificationStatus verified;
- formula;
- day/night variants if applicable;
- required inputs;
- source note;
- limitations;
- interpretation false.

## Formula Conflict Policy

If two sources give different formulas:

- keep the Lot inactive;
- document conflict;
- mark `needsReview`;
- do not calculate the Lot.

## No Formula From Memory

Do not activate any formula because it is familiar or commonly repeated.

Source notes must be explicit.

## Dataset Policy

Existing active rows:

- `pars-fortuna`;
- `lot-of-spirit`.

Candidate rows must not change those formulas.

New rows must not activate automatically.

## Runtime Policy

Formula dataset is data-only.

Runtime calculation happens in `src/arabicParts.js` only after dataset verification.

Do not add dependencies for formula lookup.

## Privacy

Formula rows, UI, and debug must not expose:

- raw birthDate;
- raw birthTime;
- utcDateTime;
- raw timezone;
- coordinates;
- full profile JSON;
- provider payload.

## Interpretation Policy

No interpretation text in Sprint 15.

Forbidden:

- karmic meaning;
- predictions;
- ritual advice;
- fatalistic claims;
- psychological labels.

## Task 15.2 Exit Criteria

Task 15.2 is complete only when it decides:

- source corpus/tradition;
- candidate verification path;
- formula conflict handling;
- active/deferred criteria;
- next active Lot verification task.

If source policy cannot be decided, implementation must be blocked until resolved.

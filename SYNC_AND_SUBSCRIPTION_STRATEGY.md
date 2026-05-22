# SYNC_AND_SUBSCRIPTION_STRATEGY.md

# Astro PWA — Sync and Subscription Strategy

## Purpose

This document records the future strategy for server sync, paid subscription, and secure cloud backup.

It is a roadmap / architecture planning document only.

It does not activate implementation work.
It does not change the current active sprint.
It does not replace `TODO.md`.
Do not implement sync, accounts, payments, backend, or cloud storage until they are explicitly moved into `TODO.md`.

Current active sprint remains whatever `PROJECT_STATE.md` and `TODO.md` define.

---

## Current Decision

Astro PWA stays local-first for now.

Current approach:

- profiles are stored locally on the device;
- import/export JSON remains available;
- calculations happen locally;
- birth data is not sent to a server;
- no backend;
- no account system;
- no cloud sync;
- no subscription system yet.

Strategic direction:

> Local-first now, sync-ready architecture, optional secure cloud later.

---

## Why Not Server Now

Server storage is not needed for the current stage.

Adding a server now would introduce:

- account system;
- authentication;
- password / recovery flow;
- database;
- payment/subscription logic;
- encryption strategy;
- deletion/export policy;
- privacy policy;
- backup and restore logic;
- breach/security risk;
- higher development and maintenance complexity.

It would also not solve the current calculation problem by itself.

The current blocker for natal planets is:

```txt
local birth date + local birth time + birth timezone -> reliable UTC datetime
```

That should be solved locally first.

---

## Why Local-First Is Still Not Final

Pure local-only storage has limitations:

- deleting the PWA can delete profile data;
- clearing Safari/browser data can remove profiles;
- no automatic sync between iPhone / iPad / Mac;
- no account recovery;
- no subscription/payment identity;
- manual JSON import/export is useful but not seamless;
- paid product experience eventually needs better backup/sync.

Therefore the architecture should remain sync-ready.

---

## Required Architecture Principle

Do not let UI depend directly on storage implementation details.

Preferred direction:

```txt
UI
  -> profile service / profile repository
    -> local profile storage
    -> future encrypted sync storage
```

Current modules should remain easy to evolve:

- `profileModel`
- `profileStorage`
- profile import/export
- active profile state
- future profile sync boundary

Future sync should be added as a new layer, not by rewriting UI everywhere.

---

## Future Sync Modes

### Mode 1 — Local Only

Default mode.

Behavior:

- all profile data stays on the device;
- no account required;
- import/export available;
- calculations are local.

This should remain available even if cloud sync is added later.

### Mode 2 — Manual Backup

Already partly supported through JSON export/import.

Future improvements:

- export all profiles;
- import merge rules;
- encrypted backup file;
- backup warnings;
- restore validation;
- duplicate detection.

### Mode 3 — Secure Cloud Sync

Future paid/pro mode.

Possible behavior:

- user creates account;
- user explicitly enables sync;
- profiles sync between iPhone / iPad / Mac;
- encrypted backup;
- user can delete cloud data;
- user can disable sync and return to local-only;
- local calculations remain possible.

### Mode 4 — Subscription Without Birth Data Sync

Possible intermediate option.

Behavior:

- account/subscription exists;
- birth data remains local;
- server only tracks payment/access;
- optional manual encrypted backup remains separate.

This can be a strong privacy-first product position.

---

## Privacy Principles

Birth data is sensitive.

Sensitive data includes:

- birth date;
- birth time;
- birth place;
- coordinates;
- timezone;
- natal settings;
- calculated natal points;
- profile names if personally identifying.

Rules:

- do not send birth data to server without explicit user consent;
- do not add silent sync;
- do not add analytics with birth data;
- do not add remote calculation by default;
- do not add geocoding API without explicit approval;
- do not store raw birth data in logs;
- do not expose full profile JSON in debug;
- user must be able to delete profile data.

---

## Secure Cloud Sync Requirements

Before cloud sync can be implemented, the project must define:

### Account

- login method;
- email/password or OAuth;
- password reset;
- account deletion;
- session management.

### Data Model

- user id;
- profile ids;
- profile versioning;
- updatedAt conflict strategy;
- deleted profile tombstones;
- schemaVersion.

### Security

- encryption at rest;
- encryption in transit;
- whether data is end-to-end encrypted;
- key management;
- recovery strategy;
- breach impact.

### User Consent

UI must explicitly say:

```txt
Синхронизация выключена.
Данные карты хранятся на этом устройстве.
```

If enabling sync:

```txt
Включить защищенную синхронизацию?
Данные карт будут сохраняться в облаке для восстановления и переноса между устройствами.
```

### Data Deletion

Must support:

- delete local profile;
- delete cloud profile;
- delete all account data;
- export before deletion;
- sync deletion across devices.

### Backup / Restore

Must support:

- export JSON;
- import JSON;
- optional encrypted backup;
- cloud restore;
- duplicate detection;
- conflict handling.

---

## Subscription Strategy

Paid subscription can be added later.

Possible paid features:

- secure cloud backup;
- multi-device sync;
- advanced natal modules;
- personal transits;
- fixed stars;
- Arabic Parts;
- advanced recommendations;
- long-term calendar;
- notification/reminder features.

Important:

Subscription does not require sending birth data to server if product chooses local-only calculations.

Possible product positioning:

```txt
Расчеты выполняются на устройстве.
Синхронизация включается только по вашему согласию.
```

---

## Server Architecture Options

### Option A — Account + Payment Only

Server stores:

- account;
- subscription status;
- billing provider id.

Server does not store:

- birth data;
- profiles;
- natal calculations.

Pros:

- privacy-first;
- simpler security model;
- compatible with local-first calculations.

Cons:

- no automatic backup/sync.

### Option B — Encrypted Cloud Backup

Server stores encrypted profile data.

Pros:

- backup/restore;
- cross-device sync;
- better paid product experience.

Cons:

- key management;
- recovery complexity;
- user trust/privacy burden.

### Option C — Server-Side Calculation

Server calculates natal/transit data.

Pros:

- can use Swiss Ephemeris server-side;
- easier provider management;
- easier heavy computation.

Cons:

- birth data goes to server;
- stronger privacy/legal burden;
- backend dependency;
- less local-first.

Current recommendation:

Do not use server-side calculation by default.

If server-side calculation is ever considered, it must be a separate explicitly approved sprint.

---

## Future Sprint Proposal

### Future Sprint — Secure Cloud Sync / Subscription Foundation

Possible tasks:

1. Sync Strategy and Threat Model
2. Account / Auth Decision
3. Payment / Subscription Decision
4. Storage Adapter Refactor
5. Encrypted Backup Format
6. Cloud Sync Prototype
7. Conflict Resolution
8. Delete / Export / Restore Flow
9. Privacy Copy and Consent UI
10. Security Hardening

This sprint should happen after the app has enough value to justify accounts/subscriptions.

---

## What Not To Do Now

Do not implement now:

- backend;
- account system;
- payment integration;
- cloud database;
- automatic sync;
- remote calculation;
- geocoding service;
- analytics with birth data;
- silent upload of profiles;
- subscription logic.

---

## Immediate Current Path

Continue current sprint work:

- keep calculations local;
- keep profile data local;
- keep import/export;
- implement natal readiness and display only when safe;
- preserve clean boundaries for future sync.

---

## Decision Log

- Current decision: local-first now.
- Future direction: sync-ready architecture.
- Future cloud sync: optional and explicit.
- Future subscription: likely, but not tied to sending birth data to server.
- Server-side birth data storage/calculation: not approved.

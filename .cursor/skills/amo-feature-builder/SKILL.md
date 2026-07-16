---
name: amo-feature-builder
description: Use this skill when implementing any AMO ID Santé Mali business feature end-to-end across backend, mobile, database, audit, security, and tests.
---

# AMO Feature Builder

## Purpose

Use this skill when the user asks to implement, design, scaffold, review, or modify a business feature for AMO ID Santé Mali.

Examples:
- Implement beneficiary enrollment
- Implement point-of-care facial verification
- Implement temporary QR generation
- Implement agent authentication
- Implement eligibility verification
- Implement offline synchronization

## Mandatory project context

Before coding:
1. Read `AGENTS.md`.
2. Read relevant files in `.cursor/rules/`.
3. Read `docs/Spec_AMO_ID_Sante_Mali_MVP_IA.md`.
4. Read `docs/AMO_ID_Sante_Mali_Decisions_Techniques.md`.

Do not invent undocumented product or technical decisions.

## Required output structure

For every feature, produce or update:

1. Business understanding
2. Backend impact
3. Database impact
4. Mobile impact
5. Security impact
6. Audit impact
7. Offline impact, if relevant
8. Tests to add
9. Files to create or modify
10. Risks or open decisions

## Non-negotiable rules

- The mobile app must never call CompreFace directly.
- All biometric calls must go through the NestJS API.
- No raw face photo should be stored after template creation.
- No medical or biometric data in logs, QR payloads, or public API responses.
- `audit_logs` is append-only.
- Temporary QR validation must always be coupled with facial verification.
- TypeScript strict mode everywhere.
- No `any`.
- Code and comments in English.
- UI and user-facing messages in French.

## Backend expectations

Use NestJS modules:
- auth
- users
- beneficiaries
- biometrics
- eligibility
- temporary-qr
- audit
- establishments
- sync

Each sensitive action must create an audit log.

## Mobile expectations

The app must support:
- smartphone layout
- tablet layout
- role-based navigation
- French UI
- local offline queue when relevant
- secure token storage
- no direct biometric engine access

## Completion checklist

Before finalizing, verify:
- Guards and roles are applied
- DTOs have validation
- Prisma schema is coherent
- Sensitive fields are not exposed
- Audit event exists
- Offline behavior is clear
- Tests are proposed or created
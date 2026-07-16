---
name: prisma-supabase-modeling
description: Use this skill when designing or modifying Prisma schema, Supabase Postgres tables, migrations, indexes, enums, relations, and database constraints for AMO ID Santé Mali.
---

# Prisma Supabase Modeling

## Purpose

Use this skill for:
- Prisma schema design
- migrations
- Supabase Postgres modeling
- indexes
- enums
- relations
- sensitive data separation
- database review

## Naming rules

Use:
- Prisma models in PascalCase
- database tables in snake_case using `@@map`
- columns in snake_case using `@map`
- enum values explicit and stable

## Sensitive data separation

Separate:
- beneficiaries
- biometric templates
- optional emergency health data
- audit logs
- temporary QR tokens
- agents
- devices
- establishments

Do not mix medical, biometric, and identity data in one large table.

## Required model families

Expected entities may include:

- users
- roles
- devices
- establishments
- beneficiaries
- beneficiary_relationships
- biometric_templates
- eligibility_statuses
- temporary_qr_tokens
- temporary_qr_usages
- audit_logs
- offline_sync_batches
- offline_sync_actions

## Audit table rule

`audit_logs` is append-only.

Never generate code or migration that updates or deletes audit logs.

## QR rules

Temporary QR data must include:
- opaque beneficiary reference
- expiration
- revocation status
- created by
- reason
- audit trail

Do not store medical data in QR-related tables.

## Indexing rules

Add indexes for:
- AMO number
- NINA if available
- phone if searchable
- beneficiary status
- establishment
- QR token id/hash
- audit timestamp
- audit actor
- audit action type

## Prisma rules

- Use relations explicitly.
- Use transactions for sensitive workflows.
- Avoid nullable fields unless justified.
- Prefer enums for statuses and roles.
- Never expose Prisma models directly in API responses.

## Completion checklist

Before finalizing:
- schema supports documented workflows
- sensitive data is separated
- audit logs append-only rule respected
- indexes added for search and audit
- migration name is explicit
- no undocumented assumptions
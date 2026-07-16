---
name: qr-audit-security-review
description: Use this skill when implementing or reviewing temporary QR codes, signed tokens, JWS/JWT, audit logs, sensitive logs, fraud checks, and security-sensitive flows.
---

# QR Audit Security Review

## Purpose

Use this skill for:
- temporary QR generation
- temporary QR scan
- QR revocation
- JWS/JWT signing
- audit logs
- fraud detection
- suspicious actions
- security review

## Temporary QR rules

A temporary QR must:
- be signed by the backend
- have an expiration date
- have a revocation mechanism
- use an opaque beneficiary identifier
- contain minimal payload
- contain no medical data
- contain no biometric data
- be linked to an audit trail
- never be accepted alone without facial verification

## Validation flow

Correct QR validation:
1. Scan QR.
2. Verify signature.
3. Verify expiration.
4. Verify revocation status.
5. Identify related beneficiary using opaque reference.
6. Require facial verification or authorized manual validation.
7. Verify eligibility.
8. Write audit log.
9. Return safe result to agent.

## Audit rules

Audit every sensitive action:
- QR generation
- QR scan
- QR validation success
- QR validation failure
- QR revocation
- repeated failures
- manual override
- suspicious access

## Log safety

Never log:
- full QR token
- private keys
- biometric payload
- medical data
- raw personal data beyond what is required for audit traceability

## Token safety

Use:
- RS256 or documented signing algorithm
- private key only on backend
- key rotation readiness
- token hash in database if storing reference
- short expiration

## Completion checklist

Before finalizing:
- signed payload is minimal
- expiration exists
- revocation exists
- facial verification is required
- audit exists
- no sensitive logs
- roles and device constraints are checked
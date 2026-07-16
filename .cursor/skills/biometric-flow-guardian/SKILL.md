---
name: biometric-flow-guardian
description: Use this skill when implementing, reviewing, or modifying biometric enrollment, facial verification, CompreFace integration, liveness detection, or biometric security.
---

# Biometric Flow Guardian

## Purpose

Use this skill for anything related to:
- facial enrollment
- facial verification
- CompreFace API
- biometric template creation
- liveness detection
- image quality checks
- anti-spoofing
- biometric audit
- biometric errors

## Core architecture

The mobile app must never call CompreFace directly.

Correct flow:
1. Mobile captures face.
2. Mobile performs local quality checks.
3. Mobile performs liveness challenge if required.
4. Mobile sends capture to NestJS API.
5. NestJS validates agent, role, device, and intent.
6. NestJS calls CompreFace.
7. NestJS stores only approved biometric metadata/template reference.
8. NestJS deletes or avoids storing raw photo after processing.
9. NestJS writes audit log.
10. NestJS returns a safe status to mobile.

## Safe result statuses

Return simple statuses:
- confirmed
- doubtful
- failed
- manual_review_required

Do not expose raw CompreFace internals to the mobile UI.

## Enrollment rules

For enrollment:
- validate beneficiary exists or is being created
- check agent role
- check device authorization
- check image quality
- check liveness
- create template through backend only
- do not keep raw photo
- audit the action

## Verification rules

For point-of-care verification:
- check agent role
- check establishment authorization
- check device authorization
- perform liveness
- call backend
- backend calls CompreFace
- cross-check eligibility
- return safe identity confirmation
- audit every attempt, including failures

## Forbidden

Never:
- store raw face images permanently
- store biometric templates on mobile
- log images
- log biometric payloads
- put biometric data in QR
- expose CompreFace API keys to mobile
- allow mobile-to-CompreFace direct calls
- make QR validation replace facial verification

## Completion checklist

Before finalizing:
- backend controls CompreFace
- liveness is considered
- quality check is considered
- raw image retention is avoided
- audit log exists
- safe response DTO exists
- suspicious failures are handled
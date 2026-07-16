---
name: test-review-qa
description: Use this skill when reviewing code quality, adding tests, validating security-sensitive flows, or preparing manual QA scenarios for AMO ID Santé Mali.
---

# Test Review QA

## Purpose

Use this skill for:
- unit tests
- integration tests
- E2E tests
- manual QA scenarios
- security checks
- regression checks
- code review

## Required test categories

For backend:
- service unit tests
- controller tests when useful
- DTO validation tests
- guard and role tests
- Prisma transaction tests
- QR signing and validation tests
- audit log tests
- failure scenario tests

For mobile:
- screen rendering tests
- form validation tests
- API hook tests
- offline queue tests
- role-based navigation tests
- error state tests
- loading state tests

For security:
- unauthorized access
- wrong role
- revoked device
- expired QR
- revoked QR
- QR without facial verification
- invalid biometric result
- repeated failures
- sensitive data leakage

## Manual QA format

For each feature, provide manual test cases:

```txt
Scenario:
Given:
When:
Then:
Expected audit:
Expected security behavior:
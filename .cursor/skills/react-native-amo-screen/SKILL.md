---
name: react-native-amo-screen
description: Use this skill when creating or modifying React Native mobile screens, navigation, hooks, API calls, offline behavior, or UI components for AMO ID Santé Mali.
---

# React Native AMO Screen

## Purpose

Use this skill for all mobile work in `mobile/`.

Examples:
- Create a screen
- Create a camera capture flow
- Create role-based navigation
- Create a form
- Create an offline queue UI
- Create a verification result screen
- Create tablet and smartphone layouts

## UI language

All user-facing text must be in French.

Code, comments, function names, variables, and filenames must be in English.

## Layout rules

The app must support:
- smartphone screens
- tablet screens
- responsive layout
- simple field agents UI
- large buttons
- clear statuses
- minimal cognitive load

Recommended patterns:
- smartphone and tablet: stack navigation from home hub
- tablet: side panel + content area

## Role-based navigation

Screens must be visible according to user role:
- admin CANAM / AMO
- superviseur régional
- agent d’enrôlement
- agent point de soin
- superviseur établissement
- auditeur

Never show unauthorized actions in the UI.

## Security rules

- Store JWT securely.
- Do not store JWT in plain AsyncStorage.
- Use secure storage for tokens.
- Include device identifier in protected API requests.
- Do not call CompreFace from mobile.
- Do not store raw face photos permanently.
- Do not store biometric templates on the device.
- Do not show raw biometric scores to agents.

## API rules

All API calls must go through `mobile/src/api/`.

Use:
- typed request functions
- typed response DTOs
- safe error handling
- French user messages

## Offline rules

If a feature can happen in poor network conditions:
- use SQLite cache for read-only data
- use offline queue for pending actions
- display pending sync status
- retry sync when connection returns
- never silently merge conflicts

## File structure

Prefer:

```txt
mobile/src/screens/<feature>/
  <Feature>Screen.tsx
  components/
  hooks/
  types.ts
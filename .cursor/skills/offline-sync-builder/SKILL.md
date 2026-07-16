---
name: offline-sync-builder
description: Use this skill when implementing offline cache, SQLite local storage, offline action queue, sync endpoint, conflict handling, or network recovery for AMO ID Santé Mali.
---

# Offline Sync Builder

## Purpose

Use this skill for:
- offline mode
- SQLite cache
- offline action queue
- sync service
- sync endpoint
- conflict handling
- network recovery
- mobile pending actions UI

## MVP offline strategy

Do not implement full bidirectional sync.

Use:
- read-only local cache
- local offline action queue
- delayed synchronization
- server-side conflict rejection
- clear user notification

## Mobile rules

On mobile:
- store cached read-only beneficiary references if allowed
- store pending actions in SQLite
- store action type, timestamp, actor, device, payload, and status
- do not store biometric templates locally
- do not store raw face photos permanently
- show pending sync status to agent
- retry when network returns

## Backend rules

On backend:
- expose a dedicated sync endpoint
- validate every queued action again
- never trust offline payload blindly
- check agent, role, device, establishment, and timestamps
- reject conflicts explicitly
- audit accepted and rejected sync actions

## Conflict handling

If the same beneficiary or QR has changed on the server:
- reject the action
- return a safe reason
- notify the agent
- do not silently merge

## Queue statuses

Use statuses like:
- pending
- syncing
- synced
- rejected
- failed_retryable
- failed_final

## Completion checklist

Before finalizing:
- offline data minimized
- no biometric template stored locally
- no raw photo stored permanently
- queue schema exists
- sync endpoint validates everything
- conflicts are rejected safely
- audit logs are written
- UI shows pending/rejected states
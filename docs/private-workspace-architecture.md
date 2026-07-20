# Lucinuo private workspace architecture

## Decision

Use the functional name **Private workspace / 私人工作區** until an internal name proves useful in daily use. Do not treat it as a public product or place it in the primary public navigation.

The private workspace must not be hosted as an unprotected GitHub Pages route. A hidden URL, front-end password, or obfuscated JavaScript is not authentication.

## Recommended deployment boundary

- Public website: `lucinuo.github.io`, public repository, static GitHub Pages.
- Private application: separate private repository and separate deployment origin.
- Authentication: a real identity provider with one permitted user account. Recommended first implementation: Supabase Auth with an explicit allow-list for Lucille's account. Sign in with Apple can be added after the Apple service identifier and redirect configuration are available.
- Private records: database rows owned by the authenticated user ID and protected by row-level security.
- Secrets: deployment environment variables only. No service-role key, refresh token, private record, sync credential, or account identifier in the public repository.
- Files: private object storage with user-scoped access policies. Public URLs are not acceptable for personal exports or attachments.

## Access rules

1. Unauthenticated requests see only the sign-in screen.
2. An authenticated account that is not explicitly allowed receives no workspace data and cannot create records.
3. Every read and write is checked on the server/database boundary, not only hidden in the interface.
4. Session cookies or tokens use the provider's supported secure storage. Credentials are never written to repository files or exported backups.
5. Public Lucinuo pages do not load private workspace scripts, records, or sync configuration.

## Migration release gate

Do not merge the public withdrawal of `/bearing/` until all of the following are true:

1. The private application is deployed behind real authentication.
2. The existing Bearing v3 data format and legacy Growth Compass v1/v2 backups can be imported.
3. Current device-local records have been exported or transferred and verified in the private account.
4. Record counts and representative entries have been checked after migration.
5. A recovery export has been downloaded and opened successfully.
6. Only then should `/bearing/` and `/growth-compass/` redirect to the private workspace boundary.

The old browser storage keys should remain read-only migration inputs. Migration must copy data into the private account before any old keys are retired; it must never silently delete the local originals.

## Public/private content boundary

Public Lucinuo contains research direction, verified publications, selected project explanations, public code links, and professional background.

Private workspace contains reflection, present-state notes, next-step planning, personal records, sync state, backups, and account settings. None of those records should be indexed, embedded in public HTML, committed to GitHub, or exposed through public analytics.

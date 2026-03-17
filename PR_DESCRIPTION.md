# Feat: Legacy Auth Parity for Eyebrow + Magic Login Flows

## Description
This PR brings the legacy monorepo behavior in line with the Next implementation for the guest eyebrow CTA and magic-login/onboarding entry points.

It adds the missing backend onboarding-link mutation, updates the eyebrow UX to handle all status branches consistently, and adds targeted test coverage for critical parity paths on both client and server.

## Changes
- **Eyebrow CTA parity (`client`)**
    - Refactored `EyebrowBar` flow to branch by `checkEmailStatus` and show modal-based actions for:
        - `registered` -> login options modal (magic link or password login)
        - `approved_no_password` -> onboarding completion modal
    - Added dismiss behavior and preserved layout offset updates (`--eyebrow-height`).
    - Normalized email input (`trim`) before network calls.
    - Updated mutation handling to honor backend payloads (`success/message`) instead of assuming transport-level success.
    - Added fallback behavior: if magic-link mutation returns incomplete-signup response, transition to onboarding modal.

- **Client GraphQL contract updates**
    - Added `SEND_ONBOARDING_COMPLETION_LINK` mutation in `client/src/graphql/mutations.jsx`.

- **Magic login page hardening (`client`)**
    - Kept token verification/login redirect flow aligned with parity behavior.
    - Added tests for missing token, invalid token, valid token login dispatch + redirect, and expired token messaging.

- **Backend parity (`server`)**
    - Added new resolver `sendOnboardingCompletionLink`:
        - sends tokenized `/auth/signup?token=...` onboarding link for approved users without passwords
        - returns generic success for non-eligible accounts to avoid account enumeration
    - Wired resolver into mutation exports and root mutation map.
    - Added schema mutation definition: `sendOnboardingCompletionLink(email: String!): JSON`.
    - Allowed public access for new onboarding-link mutation via `requireAuth` allowlist.

- **Automated tests added**
    - `client/src/components/EyebrowBar/EyebrowBar.test.jsx`
    - `client/src/views/MagicLoginPage/MagicLoginPage.test.jsx`
    - `server/app/tests/queries/user/checkEmailStatus.test.js`
    - `server/app/tests/mutations/user/sendMagicLoginLink.test.js`
    - `server/app/tests/mutations/user/sendOnboardingCompletionLink.test.js`

## Verification
- **Client tests**
    - `npm run test -- src/components/EyebrowBar/EyebrowBar.test.jsx src/views/MagicLoginPage/MagicLoginPage.test.jsx`
    - Result: passing (11 tests)

- **Server tests**
    - `npm run test -- --runInBand app/tests/queries/user/checkEmailStatus.test.js app/tests/mutations/user/sendMagicLoginLink.test.js app/tests/mutations/user/sendOnboardingCompletionLink.test.js`
    - Result: passing (11 tests)

- **Lint / style**
    - Client files linted and auto-fixed for repository rules; remaining warnings are existing workspace alias-resolution warnings for `@/...` imports.
    - Prettier was applied to all files changed in this PR.

## Notes
- This PR intentionally focuses on parity-critical auth paths and their regression coverage.
- A full-suite regression run can be done separately if broader release confidence is required.

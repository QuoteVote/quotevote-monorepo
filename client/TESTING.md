This repository's test guidance (short)

Purpose
- Document the "mock-before-import" pattern used to make Vitest runs deterministic and to avoid importing heavy/SSR-breaking third-party modules during test import time.

Key files
- `src/test-setup-mocks.js` — runs before `setupTests.js` and registers global test-time mocks and shims. This file registers:
  - A wrapped `render` for Testing Library so tests automatically get `AllProviders`.
  - A shim/mock for `react-material-ui-carousel`.
  - Legacy `@material-ui/core` compatibility shims.
  - A partial mock for `@apollo/react-hooks` that preserves module exports and returns a safe default for `useMutation`.

Mock-before-import pattern
- Some components call hooks (like `useMutation`) at module scope or during import; to avoid those causing the real Apollo hooks (or other libs) to be loaded into the module cache before tests can mock them, always register the mock before importing the component under test.

How to write tests safely
1. Prefer the centralized partial mock in `src/test-setup-mocks.js`. It returns a tuple `[mutateFn, { loading: false, error: null, data: undefined }]` for `useMutation` by default. Most tests will not need to mock Apollo themselves.

2. When a test needs to assert mutation calls or change behavior of `useMutation`:
   - Use the per-test `vi.mock` pattern at the very top of the test file, before any imports of the module under test:

     if (typeof vi !== 'undefined' && typeof vi.mock === 'function') {
       vi.mock('@apollo/react-hooks', async (importOriginal) => {
         const actual = await importOriginal()
         const mockMutate = vi.fn()
         const mockResult = { loading: false, error: null, data: undefined }
         return { ...actual, useMutation: () => [mockMutate, mockResult] }
       })
     }

   - Then import the component after the mock block. This ensures the test's mocked version is used by the component when it initializes.

3. If a test needs to simulate mutation status changes (loading -> success), your test can spy on the mock mutate function returned above and simulate state by re-rendering with a different mocked result or by providing helper wrappers.

Triage quick wins
- Wrap renders or any event that triggers state changes in `act(...)` (import `act` from `react-dom/test-utils`) if you see `An update to X inside a test was not wrapped in act(...)` warnings.
- If you see PropTypes warnings in tests, prefer fixing the test fixture to pass required props (fast and safe).

Contact
- If you want, we can further centralize common test fixtures and helper utilities (e.g. a `renderWithProviders` helper exported from `src/test-utils.js`).

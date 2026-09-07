# Authentication Test Design

This document converts the verified authentication exploration findings into a
structured, evidence-backed test suite. It is design only — no test code.

All expected behavior traces to the exploration in
`evaluation/authentication-exploration.md` (and `evaluation/exploration.md`).

---

## Evidence baseline

Behavior classifications used throughout:

- **Observed** — verified through Playwright MCP browser interaction and/or
  repository source inspection.
- **Inferred** — a reasonable conclusion supported by multiple observations but
  not directly exercised.
- **Unknown** — could not be established from available evidence.

The following exploration findings are the sole source for the scenarios below:

| # | Finding | Classification |
| --- | --- | --- |
| E1 | Login entry point is the "Form Authentication" section, reached via sidebar `navigate('login')`; URL does not change. | Observed |
| E2 | UI elements: `#login-username` (text), `#login-password` (password), `#login-btn` button (label "Login"), hint text, `#login-alert` container, and `#login-result` box (initial text `"Awaiting login..."`). Inputs have no `name`/`required`; not inside a `<form>`. | Observed |
| E3 | Valid credentials `tomsmith` / `SuperSecretPassword!` (also disclosed in-page). | Observed |
| E4 | Empty password and/or username → alert `Please fill in all fields.` and result `Login failed: missing credentials`. | Observed |
| E5 | Any non-matching username/password → alert `✗ Your username is invalid!` and result `Login failed: invalid credentials`. Invalid password with valid username yields the same message as invalid username. | Observed |
| E6 | Valid credentials → alert `✓ You logged into a secure area!` and result `Login successful! Welcome, tomsmith.`; no navigation occurs. | Observed |
| E7 | No `localStorage`, `sessionStorage`, or cookies written after login; no persistence. | Observed |
| E8 | No logout control; no protected routes. All sections always reachable. | Observed |
| E9 | `handleLogin()` (scripts.js lines 21–40) uses a single `if (!user || !pass)` branch for missing fields, a success branch for exact match, and a generic `else` for everything else. The "alert" is an inline `<div>`, not a browser `alert()`. | Observed (source) |
| E10 | Pressing Enter in an input will not submit (no `<form>`; button wired to `onclick` only). | Inferred |

---

## Proposed test scenarios

### AUTH-01 — Successful login with valid credentials

- **Objective**: Verify that entering the correct credentials produces the
  success feedback and indicates a logged-in ("secure area") state.
- **Preconditions**: Application served and loaded; "Form Authentication"
  section visible.
- **Test data**:
  - Username: `tomsmith`
  - Password: `SuperSecretPassword!`
- **Steps**:
  1. Navigate to the "Form Authentication" section.
  2. Enter `tomsmith` in the username field.
  3. Enter `SuperSecretPassword!` in the password field.
  4. Click the "Login" button.
- **Expected result**:
  - Alert area displays `✓ You logged into a secure area!`.
  - Result area displays `Login successful! Welcome, tomsmith.`.
  - Page stays on the same section (no navigation/URL change).
- **Priority**: Critical.
- **Rationale**: This is the core happy path; without it no other authentication
  behavior is meaningful.
- **Evidence**: E3, E6.

### AUTH-02 — Missing required credentials show validation message

- **Objective**: Verify that submitting with missing required field(s) produces
  the validation message instead of an invalid-credentials message.
- **Preconditions**: Application loaded; "Form Authentication" section visible.
- **Test data** (three variations, all hitting the same `!user || !pass` branch):
  - (a) username empty, password empty
  - (b) username empty, password `SuperSecretPassword!`
  - (c) username `tomsmith`, password empty
- **Steps**:
  1. Navigate to the "Form Authentication" section.
  2. For each variation, set the username/password fields accordingly.
  3. Click the "Login" button.
- **Expected result**:
  - Alert area displays `Please fill in all fields.`.
  - Result area displays `Login failed: missing credentials`.
  - No success message.
- **Priority**: High.
- **Rationale**: Validation is user-visible and distinct from the invalid-credentials
  path. The three variations share one code branch, so they are consolidated
  into a single scenario parameterized by data rather than three near-identical
  tests.
- **Evidence**: E4, E9.

### AUTH-03 — Invalid credentials show generic invalid-credentials message

- **Objective**: Verify that non-matching credentials produce the generic
  invalid message, and that the app does not distinguish between an invalid
  username and an invalid password.
- **Preconditions**: Application loaded; "Form Authentication" section visible.
- **Test data** (two variations, both hitting the generic `else` branch):
  - (a) username `wronguser`, password `SuperSecretPassword!`
  - (b) username `tomsmith`, password `wrongpassword`
- **Steps**:
  1. Navigate to the "Form Authentication" section.
  2. For each variation, set the fields accordingly.
  3. Click the "Login" button.
- **Expected result**:
  - Alert area displays `✗ Your username is invalid!`.
  - Result area displays `Login failed: invalid credentials`.
  - Message is identical for an invalid username and an invalid password.
- **Priority**: High.
- **Rationale**: This is a key negative path and documents a notable behavioral
  detail — invalid password is not reported as a password-specific error.
- **Evidence**: E5, E9.

### AUTH-04 — Login form renders in the initial state

- **Objective**: Verify the login form presents its fields, labels, button, hint,
  and initial result placeholder.
- **Preconditions**: Application loaded; "Form Authentication" section visible.
- **Test data**: none.
- **Steps**:
  1. Navigate to the "Form Authentication" section.
  2. Inspect the rendered login card.
- **Expected result**:
  - "Username" label + username textbox (placeholder "Enter username").
  - "Password" label + password textbox (placeholder "Enter password").
  - "Login" button present.
  - Hint text showing the disposable credentials (`tomsmith` /
    `SuperSecretPassword!`).
  - Result area initially shows `Awaiting login...`.
- **Priority**: Medium.
- **Rationale**: Establishes the baseline needed to make the other scenarios
  deterministic and to catch regressions in the entry-point UI.
- **Evidence**: E2.

---

## 1. Coverage summary

| Area | Covered by | Notes |
| --- | --- | --- |
| Successful authentication | AUTH-01 | Covered |
| Access to authenticated functionality | — | Not applicable — no protected area exists (E6, E8) |
| Missing required credentials | AUTH-02 | Covered (3 variations, one branch) |
| Invalid credentials | AUTH-03 | Covered (2 variations, one branch) |
| Account states (blocked/disabled) | — | No such state exists in the client-side app |
| Session persistence | — | Not applicable — no persistence (E7) |
| Protected routes | — | Not applicable — no protected routes (E8) |
| Logout | — | Not applicable — no logout control (E8) |
| Entry-point UI baseline | AUTH-04 | Covered |

Coverage is scoped to what the application actually exposes. Negative and
session/authorization categories that would normally be high value are absent
from this SUT by design and are therefore listed under "candidate scenarios"
below rather than as executable tests.

---

## 2. Evidence-backed test scenario list

| ID | Title | Priority | Evidence |
| --- | --- | --- | --- |
| AUTH-01 | Successful login with valid credentials | Critical | E3, E6 |
| AUTH-02 | Missing required credentials show validation message | High | E4, E9 |
| AUTH-03 | Invalid credentials show generic invalid-credentials message | High | E5, E9 |
| AUTH-04 | Login form renders in the initial state | Medium | E2 |

---

## 3. Candidate scenarios requiring additional exploration

These are NOT included as executable tests because no supporting observed
behavior exists. They would require the application to expose the corresponding
functionality (or additional investigation) first.

- **C1 — Logout behavior**: No logout control exists (E8). Cannot be tested.
- **C2 — Protected-route access after login**: No authenticated route/view exists;
  success only changes the inline message (E6, E8). Cannot be tested.
- **C3 — Session persistence across reload/navigation**: No storage or cookie is
  written (E7). Any "persistence" test would assert a non-feature; excluded.
- **C4 — Enter-key form submission**: Inferred (E10) that Enter does not submit
  because there is no `<form>`. Worth an explicit observation pass if this
  interaction matters to the product, but it is currently only inferred.
- **C5 — Account states (disabled/blocked/unknown-user enumeration)**: Only a
  single hard-coded credential pair and a single generic error branch exist
  (E5, E9). No distinct states to test.

---

## 4. Recommended authentication test suite (ordered by priority)

1. **AUTH-01** — Successful login with valid credentials (Critical)
2. **AUTH-02** — Missing required credentials validation (High)
3. **AUTH-03** — Invalid credentials error message (High)
4. **AUTH-04** — Login form initial state (Medium)

This ordering prioritizes the happy path first, then the two error/validation
paths that constitute the observable behavior of the form, and finally the
entry-point baseline. Candidates C1–C5 are deferred pending further exploration.

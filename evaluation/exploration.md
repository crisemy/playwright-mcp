# Authentication Exploration Report

## Application

- **Application URL**: `http://localhost:8123/playwright-ui-testing-lab.html`
- **Application title**: `UI Testing Lab | Playwright Practice`
- **Authentication entry point**: "Form Authentication" section, reachable from the
  left sidebar nav link (label "Form Authentication", `data-section` `login`,
  routed via `navigate('login')`). The cosmetic breadcrumb shows `Login /login`.
- **Server**: served locally via `python -m http.server 8123` from
  `ui-test-lab/ui-testing-lab/`.

## Authentication UI

The login card contains:

| Element | Role / accessible name | Attribute | Value |
| --- | --- | --- | --- |
| Card title | "Login" | — | — |
| Hint text | "Use tomsmith / SuperSecretPassword!" | — | credentials shown in badges |
| Alert container | `#login-alert` | empty `<div>` | populated by JS on submit |
| Username label | "Username" | — | — |
| Username input | textbox "Enter username" | `id=login-username`, `type=text`, `placeholder="Enter username"` | no `required`, no `name` |
| Password label | "Password" | — | — |
| Password input | textbox "Enter password" | `id=login-password`, `type=password`, `placeholder="Enter password"` | no `required`, no `name` |
| Login button | button "Login" | `id=login-btn`, `onclick="handleLogin()"` | not inside a `<form>` |
| Result box | `#login-result` | initial text `"Awaiting login..."` | updated by JS |

Notes:

- The inputs are **not** inside a `<form>` element; the button triggers
  `handleLogin()` via `onclick`. There is no HTML5 form validation, no
  `required`, and no `name` attributes.
- The "alert" referenced in the code (`#login-alert`) is a plain rendered `<div>`,
  **not** a browser `alert()` dialog. No dialog was shown during any attempt.
- Rendering errors on the page are unrelated to auth (missing `broken-link.jpg`,
  `not-found.png`, and an external `via.placeholder.com` image).

## Successful Authentication

- **Credentials used** (also disclosed in-page): username `tomsmith`, password
  `SuperSecretPassword!`.
- **Observable behavior**:
  - Alert container (`#login-alert`) renders:
    `✓ You logged into a secure area!`
  - Result box (`#login-result`) renders:
    `Login successful! Welcome, tomsmith.`
  - **No navigation** occurred: the URL and visible section remained the
    "Form Authentication" section.
- **Authenticated state**: there is no separate "secure area" page or view. The
  only indication of success is the message text shown. There is no visual or
  structural change to the rest of the app.

## Failed Authentication

Scenarios investigated and their exact resulting messages (rendered in
`#login-alert` and `#login-result`):

| Scenario | Username | Password | Alert message | Result message |
| --- | --- | --- | --- | --- |
| Both fields empty | (empty) | (empty) | `Please fill in all fields.` | `Login failed: missing credentials` |
| Missing username | (empty) | `SuperSecretPassword!` | `Please fill in all fields.` | `Login failed: missing credentials` |
| Missing password | `tomsmith` | (empty) | `Please fill in all fields.` | `Login failed: missing credentials` |
| Invalid username | `wronguser` | `SuperSecretPassword!` | `✗ Your username is invalid!` | `Login failed: invalid credentials` |
| Invalid password | `tomsmith` | `wrongpassword` | `✗ Your username is invalid!` | `Login failed: invalid credentials` |

Important finding: an invalid password with a valid username produces the **same**
message (`✗ Your username is invalid!`) as an invalid username. The application
does not distinguish between "unknown user" and "wrong password" — any
non-matching combination yields a single generic invalid-credentials message.

## Session

- **State mechanism**: none observed. After a successful login,
  `localStorage`, `sessionStorage`, and `document.cookie` were all empty.
- **Persistence**: none. Authentication is purely client-side and ephemeral; no
  token, flag, cookie, or storage entry is written.
- **Protected routes**: none. All sections (including "Form Authentication") are
  always reachable via the sidebar; access is not gated by login state.

## Logout

- **No logout control exists.** No "Logout" button or equivalent was found
  anywhere in the rendered page. There is no authentication-termination
  behavior.

## Evidence Classification

- **Observed** (verified through Playwright MCP browser interaction):
  - The login UI elements, roles, labels, placeholders, and `id`s listed above.
  - The five failure/success outcomes and their exact message strings.
  - Successful credentials `tomsmith` / `SuperSecretPassword!` (both shown
    in-page and confirmed by successful login).
  - No navigation or URL change on successful login.
  - Empty `localStorage` / `sessionStorage` / cookies after login.
  - Absence of any logout control in the rendered page.
  - No browser `alert()` dialog during any login attempt.

- **Observed** (verified against source `scripts.js` `handleLogin()`, lines 21-40,
  and `playwright-ui-testing-lab.html`, lines 243-263):
  - The exact conditionals that produce each message, confirming the above
    observations and confirming that invalid username and invalid password share
    the same branch/message.

- **Inferred**:
  - That pressing Enter inside an input will not submit the form, because the
    controls are not inside a `<form>` and login is wired to the button's
    `onclick` only. (Not directly tested.)

- **Unknown**:
  - None material to authentication. (No blocked/disabled account states or
    multi-account scenarios are exposed by the client-side implementation.)

---
name: authentication-exploration
description: Explore and characterize the authentication behavior of a web application using Playwright MCP before designing automated tests.
---

# Authentication Exploration

## Purpose

Systematically explore the authentication functionality of a web application using Playwright MCP.

The goal is to understand observable authentication behavior before any test code is generated.

Do not generate test code during this skill.

---

## Exploration Objectives

Identify and verify:

1. Authentication entry point
2. Authentication-related UI elements
3. Required credentials or authentication inputs
4. Successful authentication behavior
5. Authentication failure behavior
6. Input validation behavior
7. Different authentication/account states when discoverable
8. Authentication state persistence
9. Protected routes or protected application areas
10. Logout or authentication termination behavior when available

---

## Exploration Method

## Browser Interaction Policy

Functional exploration MUST be performed through Playwright MCP browser interaction whenever an equivalent Playwright MCP tool is available.

The agent MUST prefer real user-facing browser interactions over direct DOM manipulation.

Preferred Playwright MCP interaction tools include:

- browser_click
- browser_type
- browser_fill
- browser_select_option
- browser_check
- browser_uncheck
- browser_press_key
- browser_navigate

### browser_evaluate

`browser_evaluate` MAY be used for inspection and diagnostic purposes, including:

- inspecting DOM properties
- reading element attributes
- inspecting cookies
- inspecting localStorage
- inspecting sessionStorage
- inspecting browser state
- inspecting application state when it cannot be established through normal UI observation
- collecting diagnostic evidence

`browser_evaluate` MUST NOT be used to simulate user interactions when an equivalent Playwright MCP interaction tool is available.

Examples of prohibited use:

- setting input values directly
- clicking elements programmatically
- submitting forms programmatically
- dispatching synthetic user events
- modifying DOM state to produce an application outcome
- bypassing UI validation or application behavior

For example, do NOT use browser_evaluate to set an input value or click a button when the corresponding Playwright MCP interaction tool is available.

Instead, use the appropriate Playwright MCP interaction tool.

### Interaction Fidelity

The purpose of this skill is to characterize application behavior through realistic browser interaction.

Prefer:

User action → Playwright MCP → Application → Observable behavior

over:

Agent code → DOM manipulation → Application state

Direct DOM manipulation is permitted only when:

1. the required information cannot be obtained through normal Playwright MCP interaction, or
2. it is explicitly required for diagnostic investigation.

When browser_evaluate is used for diagnostic purposes, it MUST NOT replace a normal user interaction that could have been performed through Playwright MCP.

### 1. Establish the initial state

Navigate to the application.

Inspect the rendered page using Playwright MCP.

Identify:

- login/authentication controls
- forms
- inputs
- buttons
- links
- authentication-related messages

Do not rely solely on static HTML.

---

### 2. Inspect the authentication interface

Determine:

- element roles
- accessible names
- labels
- placeholders
- relevant attributes
- available validation indicators

Prefer user-facing and accessible characteristics over implementation-specific selectors.

---

### 3. Investigate validation

Where applicable, test incomplete authentication attempts.

Examples include:

- missing username
- missing password
- missing credentials
- invalid input

Record the actual application response.

Do not assume the expected error message.

---

### 4. Investigate unsuccessful authentication

Where test credentials or discoverable account information are available, investigate unsuccessful authentication.

Examples:

- unknown user
- invalid password
- invalid credential combinations
- blocked or disabled account states

Only test scenarios that can be safely and legitimately investigated in the application.

Record the exact observable behavior.

---

### 5. Investigate successful authentication

If valid credentials are available:

- authenticate
- observe navigation
- inspect the resulting page
- identify authenticated state
- identify relevant cookies or storage when useful
- determine whether a success message exists
- identify protected application areas

---

### 6. Investigate session behavior

When relevant, determine how authentication state is represented.

Potential evidence sources include:

- cookies
- localStorage
- sessionStorage
- URL/navigation behavior
- protected route behavior

Do not assume a particular authentication mechanism.

Verify it.

---

### 7. Investigate protected routes

If the application exposes authenticated routes:

1. Identify a protected route.
2. Access it without authentication where safely possible.
3. Observe the result.
4. Authenticate.
5. Access the route again.
6. Compare the behavior.

Record whether unauthenticated users are redirected, denied access, or otherwise restricted.

---

### 8. Investigate logout

If logout functionality exists:

- authenticate
- perform logout
- observe the resulting state
- verify whether authenticated state is removed
- attempt to access a protected area again when appropriate

---

## Evidence Rules

For every significant finding, distinguish:

### Observed

Behavior directly verified through Playwright MCP.

### Inferred

A conclusion supported by multiple observations but not directly verified.

### Unknown

Behavior that could not be established.

Never present an inference or assumption as an observed fact.

---

## Output

Produce an authentication exploration report containing:

### Application

- application URL
- authentication entry point

### Authentication UI

- fields
- controls
- relevant attributes

### Successful Authentication

- credentials used, if applicable
- navigation behavior
- authenticated state
- observable success behavior

### Failed Authentication

- scenarios investigated
- actual application responses

### Session

- authentication state mechanism
- persistence behavior
- protected routes

### Logout

- behavior, if available

### Evidence

Clearly identify observations, inferences, and unknowns.

Do not generate Playwright test code.

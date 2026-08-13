---
name: playwright-test-generation
description: Implement verified authentication test scenarios as Playwright TypeScript tests using the existing framework architecture.
---

# Playwright Test Generation

## Purpose

Implement the approved authentication test scenarios using the existing Playwright + TypeScript framework.

The existing framework is the source of truth for architecture and conventions.

---

## Required Inputs

Before generating code, use:

- authentication exploration findings
- approved test design
- existing repository structure

Do not generate tests solely from assumptions about the application.

---

## Framework Inspection

Before implementation, inspect:

- repository structure
- package.json
- Playwright configuration
- test directories
- Page Objects
- fixtures
- utilities
- existing test patterns
- naming conventions

Identify how the existing framework expects tests to be structured.

---

## Architecture Rules

The generated implementation must:

- use TypeScript
- use the existing Playwright setup
- reuse existing fixtures
- reuse existing Page Objects where applicable
- follow existing naming conventions
- follow existing folder structure
- reuse existing utilities
- avoid unnecessary duplication

Do not:

- create a competing framework
- introduce a second fixture architecture
- introduce a second Page Object architecture
- rewrite existing configuration without justification
- add unnecessary dependencies

---

## Locator Strategy

Prefer locators based on stable user-facing or accessibility characteristics.

Preferred order:

1. Existing framework locators
2. Accessible roles and names
3. Labels
4. Stable test IDs
5. Stable semantic attributes

Avoid brittle selectors such as:

- deeply nested CSS selectors
- generated class names
- positional selectors
- XPath when a stable alternative exists

Use application evidence from the exploration to determine the correct locator.

---

## Test Implementation

For each approved scenario:

1. Implement the required Page Object interaction.
2. Implement the test using the existing framework conventions.
3. Add meaningful assertions.
4. Keep tests independent and deterministic.
5. Avoid unnecessary waits.
6. Use Playwright's built-in auto-waiting and assertions where appropriate.

---

## Assertions

Assertions must verify the intended behavior.

Do not use weak assertions merely to make a test pass.

Examples of meaningful assertions include:

- expected URL
- expected page heading
- expected authenticated content
- expected validation message
- expected error message
- expected visibility/state of controls
- expected post-logout behavior

---

## Execution

After implementation:

1. Run the relevant Playwright tests.
2. Record the result.
3. Investigate failures.
4. Determine whether a failure is caused by:
   - application behavior
   - test implementation
   - locator
   - framework configuration
   - environment
5. Do not silently modify tests to make failures disappear.

---

## Output

Report:

### Files Created

List newly created files.

### Files Modified

List modified files and explain why.

### Tests Implemented

List implemented scenarios.

### Execution

Report:

- tests executed
- passed
- failed
- skipped

### Issues

Describe any unresolved problems.

Do not claim tests passed unless they were actually executed successfully.

---
name: test-design
description: Convert verified application exploration findings into a structured authentication test suite.
---

# Test Design

## Purpose

Transform verified authentication exploration findings into meaningful functional test scenarios.

This skill produces test design, not implementation.

---

## Inputs

Use:

- authentication exploration findings
- observed application behavior
- available authentication states
- verified validation behavior
- verified navigation and session behavior

Do not invent behavior that was not established during exploration.

---

## Test Design Principles

Prioritize:

1. Functional correctness
2. User-visible behavior
3. Meaningful negative scenarios
4. Authentication state transitions
5. Protected-route behavior
6. Maintainability
7. Determinism

Avoid redundant tests that verify the same behavior without providing additional coverage.

---

## Scenario Identification

Identify appropriate scenarios from the observed behavior.

Potential categories include:

### Positive

- successful authentication
- successful access to authenticated functionality

### Validation

- missing required credentials
- incomplete credentials
- invalid input

### Authentication Failure

- invalid credentials
- invalid account state
- blocked/disabled account when applicable

### Authorization / Session

- unauthenticated access to protected functionality
- authenticated access to protected functionality
- logout
- access after logout

Only include scenarios supported by evidence from the exploration.

---

## Scenario Structure

For each test scenario provide:

### ID

A unique identifier.

### Title

A concise description of the behavior.

### Preconditions

Required application state or credentials.

### Steps

High-level user actions.

### Expected Results

Observable application behavior.

### Priority

Classify as:

- Critical
- High
- Medium
- Low

### Evidence

Reference the exploration finding supporting the scenario.

---

## Assertions

Expected results should describe observable behavior.

Prefer assertions involving:

- URL/navigation
- visible elements
- visible messages
- authentication state
- protected content
- enabled/disabled controls
- user-visible application state

Avoid implementation-specific assertions unless the behavior itself requires them.

---

## Output

Produce a test design containing:

1. Coverage summary
2. Test scenarios
3. Expected results
4. Priority
5. Evidence supporting each scenario

Do not generate code.

# Skill Compliance Evaluation

## Purpose

Evaluate whether generated Playwright tests correctly implement the requirements, scenarios, expected results, evidence, and framework constraints established by the preceding QA skills.

This skill is an independent verification phase.

A test passing during execution does NOT prove that the test is correct or compliant.

The objective is to determine whether the generated implementation actually satisfies the testing intent defined by:

* authentication exploration
* test design
* playwright test generation
* the existing framework architecture

This skill evaluates existing artifacts and generated tests.

It MUST NOT generate new test scenarios or modify generated tests.

---

## Required Inputs

Before evaluation, inspect and use all available relevant evidence:

* authentication exploration findings
* approved test design
* generated Playwright tests
* existing framework architecture
* Playwright configuration
* Page Objects
* fixtures
* utilities
* package configuration
* test execution results
* Playwright execution evidence when available

The evaluator MUST NOT evaluate generated tests solely from their source code when behavioral verification can be performed.

Do not invent missing requirements.

If an expected requirement cannot be established from the available artifacts, classify it as:

**Unknown**

Do not classify unknown information as PASS.

---

# Evaluation Principles

## 1. Passing Tests Are Not Sufficient

A Playwright test that passes execution may still be non-compliant.

Examples:

* missing required assertions
* assertions unrelated to the intended behavior
* incomplete scenario implementation
* incorrect expected behavior
* weak assertions
* missing negative coverage
* framework architecture violations
* invented application behavior
* implementation that does not correspond to the approved test design

Therefore:

**Execution PASS != Compliance PASS**

---

## 2. Traceability Is Mandatory

Every approved test scenario should be traceable through:

```text
Exploration Evidence
        ↓
Test Scenario
        ↓
Implementation
        ↓
Assertion
        ↓
Observed Behavior
        ↓
Compliance Verdict
```

The evaluator MUST determine whether this chain exists.

If a scenario cannot be traced from its originating evidence through its implementation and expected behavior, report the gap.

---

# Evaluation Areas

The evaluator MUST assess the following areas.

## 1. Exploration Compliance

Verify that the test design and implementation are based on actual exploration findings.

Check:

* authentication behavior was actually investigated
* expected behavior is supported by evidence
* credentials were not invented
* locators are supported by application evidence
* navigation behavior is supported by observation
* authentication states are supported by observation
* validation behavior is supported by observation
* protected routes are supported by observation
* logout behavior is supported by observation

Detect:

* invented behavior
* unsupported expectations
* assumptions presented as facts
* scenarios without exploration evidence

### Result

Classify each relevant finding as:

* PASS
* FAIL
* UNKNOWN

---

# 2. Test Design Compliance

Verify that the generated tests implement the approved test scenarios.

For every approved scenario, verify:

* scenario ID
* scenario intent
* preconditions
* user actions
* expected results
* priority
* supporting evidence

Determine whether the implementation corresponds to the approved scenario.

Detect:

* missing scenarios
* partially implemented scenarios
* additional unsupported scenarios
* changed scenario intent
* missing steps
* missing expected results
* unsupported behavior

A generated test MUST NOT be considered compliant merely because a similarly named test exists.

The implementation must actually correspond to the scenario's intended behavior.

---

# 3. Requirement Coverage

Determine whether every required scenario from the test design has an implementation.

For each scenario classify:

* Fully Implemented
* Partially Implemented
* Not Implemented
* Unsupported Addition

Calculate:

```text
Requirement Coverage =
Fully Implemented Requirements /
Total Approved Requirements
```

Report the result explicitly.

Example:

```text
Requirement Coverage: 4/5 (80%)
```

Do not consider unsupported additional tests as coverage.

---

# 4. Step Implementation

For every implemented scenario, compare the test implementation against the approved steps.

Verify that:

* required navigation occurs
* required fields are interacted with
* required credentials are used
* required controls are activated
* required state transitions occur
* required logout behavior is exercised when specified

A test may pass while still being incomplete.

Example:

Approved:

```text
1. Navigate to login
2. Enter username
3. Enter password
4. Submit credentials
5. Verify authenticated state
```

Generated:

```text
1. Navigate to login
2. Enter username
3. Enter password
4. Submit credentials
```

Result:

```text
FAIL

Missing:
Step 5 - Verify authenticated state
```

---

# 5. Assertion Compliance

Assertions MUST verify the intended behavior.

For every expected result:

1. Identify the corresponding assertion.
2. Determine what the assertion actually verifies.
3. Compare it with the expected result.
4. Determine whether the assertion provides sufficient evidence.

Classify assertions as:

* Meaningful
* Weak
* Irrelevant
* Missing
* Incorrect

Examples of potentially meaningful assertions:

* expected URL
* expected page heading
* expected authenticated content
* expected validation message
* expected authentication state
* expected protected content
* expected logout state
* expected control visibility/state

Do not automatically consider any assertion valid merely because it uses Playwright's `expect()`.

---

# 6. Behavioral Correctness

When possible, execute the generated tests and observe the actual browser behavior.

Compare:

```text
Expected Behavior
        vs
Observed Behavior
```

Use Playwright MCP and Playwright execution evidence whenever available.

Relevant evidence may include:

* visible UI state
* accessibility snapshot
* URL/navigation
* DOM state
* cookies
* localStorage
* sessionStorage
* network activity
* console output
* test trace
* screenshots
* Playwright assertions

The evaluator MUST prefer direct observable evidence over assumptions.

---

# 7. Assertion Strength

Determine whether the assertions provide sufficient protection against incorrect application behavior.

A test is considered weak when it can pass while the intended behavior is broken.

Examples:

```text
Expected:
Successful authentication

Assertion:
URL contains "/dashboard"
```

If the dashboard can be accessed without authentication, the assertion is insufficient.

Another example:

```text
Expected:
Invalid credentials are rejected

Assertion:
Login page remains visible
```

If the application silently accepts invalid credentials while remaining on the same page, the assertion may not prove rejection.

The evaluator must consider whether the assertion actually distinguishes the intended behavior from plausible incorrect behavior.

---

# 8. Negative and Boundary Behavior

When negative scenarios are defined by the test design, verify that they are actually tested.

Examples:

* invalid credentials
* missing username
* missing password
* invalid input
* blocked account
* unauthenticated protected-route access
* access after logout

Do not accept a positive test as coverage for a negative requirement.

---

# 9. Framework Architecture Compliance

Verify that the generated tests use the existing framework as the source of truth.

Inspect:

* repository structure
* Page Objects
* fixtures
* utilities
* configuration
* naming conventions
* test organization
* existing abstractions

Verify that the generated implementation:

* uses TypeScript
* uses the existing Playwright setup
* reuses existing fixtures
* reuses existing Page Objects where applicable
* follows existing folder structure
* follows existing conventions
* reuses existing utilities where applicable
* avoids unnecessary duplication

Detect:

* competing framework architecture
* duplicated fixtures
* duplicated Page Objects
* unnecessary configuration changes
* unnecessary dependencies
* bypassing existing abstractions
* unrelated modifications

A test may be functionally correct while still failing architecture compliance.

---

# 10. Locator Compliance

Verify that locators are supported by application evidence and follow the locator strategy defined by the Playwright Test Generation skill.

Preferred order:

1. Existing framework locators
2. Accessible roles and names
3. Labels
4. Stable test IDs
5. Stable semantic attributes

Detect:

* invented locators
* brittle selectors
* generated class names
* unnecessary positional selectors
* unnecessary XPath
* locators unsupported by exploration evidence

Do not reject a locator merely because it is not the preferred type.

Evaluate whether it is stable, justified, and supported by evidence.

---

# 11. Determinism and Test Quality

Verify that generated tests:

* are independent
* are deterministic
* avoid unnecessary waits
* use Playwright auto-waiting where appropriate
* avoid unnecessary shared state
* do not depend on test execution order
* do not contain arbitrary sleeps without justification

Report potential flakiness separately from functional compliance.

---

# 12. Scope Compliance

Verify that generated changes remain within the requested scope.

Detect:

* unrelated files
* unrelated refactoring
* unnecessary framework changes
* unrelated application changes
* unnecessary dependencies
* configuration changes without justification

A test that works but modifies unrelated infrastructure is not fully compliant.

---

# Evidence Classification

Every important evaluation finding MUST be classified as:

### Observed

Directly verified through:

* Playwright MCP
* test execution
* repository inspection
* test source inspection
* trace or other execution evidence

### Inferred

A conclusion supported by multiple observations but not directly verified.

### Unknown

The available evidence is insufficient to determine compliance.

Never convert an inference or unknown into PASS.

---

# Evaluation Procedure

Follow this order.

## Step 1 — Inspect Source Artifacts

Read:

* exploration findings
* test design
* generated tests

Do not begin with test execution alone.

---

## Step 2 — Inspect Framework

Inspect:

* repository structure
* package.json
* Playwright configuration
* fixtures
* Page Objects
* utilities
* existing test patterns

Establish the framework baseline before judging architecture compliance.

---

## Step 3 — Build Traceability

For every approved test scenario establish:

```text
Scenario
    ↓
Exploration Evidence
    ↓
Implementation
    ↓
Steps
    ↓
Assertions
    ↓
Expected Result
```

Identify missing links.

---

## Step 4 — Execute Tests

Run the relevant generated tests.

Record:

* executed
* passed
* failed
* skipped

Do not modify tests merely to obtain a passing result.

---

## Step 5 — Investigate Behavioral Evidence

For relevant scenarios, inspect the actual browser behavior.

Determine whether the observed application behavior supports the assertions.

---

## Step 6 — Evaluate Compliance

Evaluate:

* exploration compliance
* test design compliance
* requirement coverage
* step implementation
* assertion compliance
* behavioral correctness
* assertion strength
* negative coverage
* architecture compliance
* locator compliance
* determinism
* scope compliance

---

## Step 7 — Produce Final Verdict

The final verdict MUST distinguish:

### Execution Status

* PASS
* FAIL
* PARTIAL
* NOT EXECUTED

### Compliance Status

* COMPLIANT
* PARTIALLY COMPLIANT
* NON-COMPLIANT
* UNDETERMINED

A passing execution status MUST NOT automatically produce a compliant result.

---

# Final Report

Produce the following report.

## Skill Compliance Evaluation

### Overall Verdict

`COMPLIANT | PARTIALLY COMPLIANT | NON-COMPLIANT | UNDETERMINED`

### Execution Status

* Tests executed
* Passed
* Failed
* Skipped

### Requirement Coverage

```text
Implemented: X/Y
Coverage: XX%
```

### Traceability

Report whether each approved scenario can be traced from exploration evidence to implementation and assertions.

### Scenario Evaluation

For each scenario report:

* ID
* Implementation status
* Step compliance
* Assertion compliance
* Behavioral compliance
* Evidence
* Verdict

### Assertion Evaluation

Report:

* meaningful assertions
* weak assertions
* missing assertions
* irrelevant assertions
* incorrect assertions

### Architecture Compliance

Report:

* framework reuse
* fixture reuse
* Page Object reuse
* configuration compliance
* dependency changes
* unrelated changes

### Locator Compliance

Report:

* locator strategy
* evidence supporting locators
* potential brittleness

### Determinism

Report potential sources of flakiness.

### Critical Findings

List all issues that prevent full compliance.

### Evidence Classification

Clearly distinguish:

* Observed
* Inferred
* Unknown

### Final Verdict

Explain why the implementation is or is not compliant.

---

# Restrictions

This skill MUST NOT:

* generate new test scenarios
* redesign the test suite
* modify generated tests
* silently fix failures
* invent missing requirements
* invent expected behavior
* fabricate execution results
* treat passing tests as proof of correctness
* replace direct evidence with assumptions

If the implementation is incorrect, report the defect.

Do not fix it.

The purpose of this skill is verification, not implementation.


# LLM Prompts — Playwright MCP

## 1. Explore the UI Testing Lab

Explore the authentication functionality of the local
ui-test-lab/ui-testing-lab/playwright-ui-testing-lab.html application.

---

## 2. Use the authentication-exploration Skill

Use the Skill `authentication-exploration` to explore the authentication functionality of the local
ui-test-lab/ui-testing-lab/playwright-ui-testing-lab.html application.

Do not generate test code.

---

## 3. Use the test-design Skill

Use the Skill `test-design` to convert the verified authentication exploration findings into a structured authentication test suite.

Use only evidence gathered during the previous authentication exploration.

Do not perform additional exploration unless explicitly required by the skill.

Do not generate Playwright test code.

For every proposed test scenario:

- Identify the objective.
- Define the preconditions.
- Define the required test data.
- Define the test steps.
- Define the expected result.
- Assign a priority.
- Explain the rationale.
- Reference the evidence supporting the scenario.

Clearly distinguish between:

- Observed behavior
- Inferred behavior
- Unknown behavior

Do not include scenarios as executable tests unless their expected behavior is supported by observed evidence.

At the end, provide:

1. A coverage summary.
2. The complete evidence-backed test scenario list.
3. A list of candidate scenarios that require additional exploration.
4. A recommended authentication test suite ordered by priority.

Do not modify files.

## 4. Use the playwright-test-generation Skill

Implement the approved authentication test scenarios from the test-design step.

Use the playwright-test-generation skill exactly.

Use the existing Playwright + TypeScript framework architecture.

Do not create a new framework.

Do not invent additional scenarios, expected results, credentials, or application behavior.

Use only the scenarios that were approved by the test-design step.

Before implementing:

- inspect the existing Playwright framework
- identify the existing Page Object Model conventions
- inspect fixtures
- inspect configuration
- inspect test organization
- inspect existing utilities

Reuse the existing architecture.

The application under test is the local UI Testing Lab:

ui-test-lab/ui-testing-lab/playwright-ui-testing-lab.html

Use Playwright MCP when browser inspection is required.

Implement the approved authentication scenarios.

Execute the generated tests.

If a test fails, investigate the failure using Playwright MCP and test execution evidence before modifying the test.

Do not modify unrelated files.

Do not generate a new framework.

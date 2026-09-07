# Model Information

This file records the model information relevant to this QA session.

## Session Context

| Property | Value |
| --- | --- |
| Model name | deepseek-v4-pro |
| Model ID | opencode/deepseek-v4-pro |
| Context size | 74,648 tokens |
| Context usage | 7% |
| Cost | $0.57 |

## Role

This model drives the AI QA agent for the `ai-qa-model-a` experiment:

- Explores the local UI Testing Lab application via Playwright MCP.
- Reasons about observable application behavior.
- Produces evidence-backed authentication exploration, test design, and
  Playwright + TypeScript test implementation using the existing framework.
- Evaluates generated tests against requirements and testing intent.

## Relevant session context

- **Application under test**: `ui-test-lab/ui-testing-lab/playwright-ui-testing-lab.html`
  (served at `http://localhost:8123`).
- **Framework**: Playwright + TypeScript skeleton under `playwright-ts/`.
- **Mandatory skills applied this session**: `authentication-exploration`,
  `test-design`, `playwright-test-generation`.
- **Artifacts produced**: `evaluation/exploration.md`,
  `evaluation/authentication-exploration.md`, `evaluation/test-design.md`,
  `playwright-ts/pages/login.page.ts`,
  `playwright-ts/tests/ui/form-authentication.spec.ts`.
- **Execution result**: 21 tests passed (7 scenarios x chromium/firefox/webkit).

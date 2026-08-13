# Playwright MCP – Agentic QA Experiment

Experimental framework for exploring how an AI agent can use Playwright MCP,
Skills, and an existing Playwright + TypeScript test skeleton to autonomously
explore a web application, design test scenarios, and generate automated tests.

## Architecture

The repository contains three main components:

### 1. Agent Instructions and Skills

`AGENTS.md` defines the global rules for the AI QA agent.

`skills/` contains specialized procedures for:

- Authentication exploration
- Test design
- Playwright test generation

### 2. UI Testing Lab

`ui-testing-lab/` is the System Under Test (SUT).

It is a local, self-contained HTML application used as the target application
for the agent's browser exploration.

No server or build step is required.

Open:

`ui-testing-lab/playwright-ui-testing-lab.html`

### 3. Playwright TypeScript Skeleton

`playwright-ts/` contains an existing Playwright + TypeScript framework
skeleton.

The AI agent must reuse this architecture when generating automated tests.

## Experimental Flow

```bash
User Request
     ↓
AGENTS.md
     ↓
Required Skill
     ↓
DeepSeek
     ↓
Playwright MCP
     ↓
UI Testing Lab
     ↓
Exploration Findings
     ↓
Test Design
     ↓
Playwright Test Generation
     ↓
Playwright TypeScript Skeleton
```

## Objective

The objective is to evaluate whether an AI agent can:

- Explore an application through Playwright MCP.
- Produce evidence-based findings.
- Design meaningful test scenarios.
- Generate maintainable Playwright + TypeScript tests.
- Reuse an existing test automation architecture rather than creating a new framework.

## Status

Experimental / Work in Progress.

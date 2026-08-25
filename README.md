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
for the agent's browser exploration. It is the System Under Test (SUT) for this
POC.

No server or build step is required for manual browsing — open:

`ui-testing-lab/playwright-ui-testing-lab.html`

### Running the SUT locally

The automated suite resolves a root-relative route at `http://localhost:8123`.
The server must therefore run from the directory that contains the HTML:

```powershell
cd ui-test-lab/ui-testing-lab
python -m http.server 8123
```

Keep this running while executing `npm run test:ui` from `playwright-ts/`.

> **Only one server should be listening on port 8123.** Running a second
> `python -m http.server` on the same port from a different directory makes
> results browser-dependent (see Troubleshooting below).

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

## Troubleshooting the SUT connection

Both failure signatures below look like test failures but are purely
environmental. The test code is unaffected.

| Symptom | Root cause | Fix |
| --- | --- | --- |
| Every test fails with `Could not connect to server` / `NS_ERROR_CONNECTION_REFUSED` on `page.goto` | No server listening on `localhost:8123` | Start the server from `ui-test-lab/ui-testing-lab` (see above) |
| Chromium & WebKit fail with a 404 ("File not found") while Firefox passes | A second `http.server` bound to IPv6 (`::`) on 8123, serving from a directory without the HTML. Chromium/WebKit resolve `localhost` to `::1`; Firefox resolves it to `127.0.0.1`, so they hit different servers | Stop all extra servers on 8123 and keep only one, launched from the correct directory |

### Why browsers disagree

`localhost` may resolve to IPv6 (`::1`) or IPv4 (`127.0.0.1`) depending on the
browser and OS. If two servers answer on 8123 — one on `127.0.0.1` and one on
`::` — Firefox and Chromium/WebKit can reach different ones, producing
browser-specific results. Keep a single server to avoid this.

## Status

Experimental / Work in Progress. This is a POC validating whether an AI agent
can drive the exploration → design → generation pipeline end to end.

## License

MIT License

Copyright (c) 2026 Cris N.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

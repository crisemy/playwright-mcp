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

### Running Playwright MCP

Playwright MCP is the browser automation server the agent uses to explore the
SUT through `@playwright/mcp`.

#### As an opencode MCP server (recommended)

The server is declared in `opencode.json` under `mcp.playwright` and is launched
automatically by opencode whenever a session starts. No manual step is required:

```json
{
  "mcp": {
    "playwright": {
      "type": "local",
      "command": ["npx", "-y", "@playwright/mcp@latest"],
      "enabled": true
    }
  }
}
```

Because the command omits `--port`, the server uses the stdio transport, which
is what MCP clients (opencode) speak by default.

#### Standalone

You can also run it directly from a terminal. A plain invocation starts a stdio
server that other MCP clients can connect to:

```powershell
npx -y @playwright/mcp@latest
```

For a network (SSE/HTTP) server that you can talk to over HTTP, pass `--port`:

```powershell
npx -y @playwright/mcp@latest --port 8931
```

Common options:

- `--browser <chrome|firefox|webkit|msedge>` — pick the browser (default: Chrome).
- `--headless` — run the browser headless (it is headed by default).
- `--isolated` — keep the profile in memory instead of saving it to disk.
- `--output-dir <path>` — directory for saved screenshots, traces, and downloads.
- `--console-level <error|warning|info|debug>` — level of console messages returned.
- `--viewport-size <width>x<height>` — browser viewport, e.g. `1280x720`.

Run `npx -y @playwright/mcp@latest --help` for the full list of options.
Requires Playwright browsers to be installed; install them with
`npx playwright install`.

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

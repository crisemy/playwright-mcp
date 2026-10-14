// WebMCP tools for the UI Testing Lab (branch: feature/webmcp-tools-poc).
//
// Purpose: expose a small, deterministic, read-mostly tool surface on top of
// the existing lab page so the Playwright MCP `webmcp_*` capability can be
// evaluated WITHOUT modifying scripts.js or the page markup.
//
// Usage (standalone MCP server with this instrumentation):
//   npx -y @playwright/mcp@latest --init-script ui-test-lab/ui-testing-lab/webmcp-tools.init.js
//
// Then navigate to http://localhost:8123/playwright-ui-testing-lab.html and
// the current tab will offer `webmcp_lab_login`, `webmcp_lab_read_result`,
// `webmcp_tables_sort` and `webmcp_tables_read_state`. WebMCP tools are
// enabled by default in @playwright/mcp >= 0.0.83; do NOT pass --no-webmcp.
// The page itself needs a WebMCP-capable browser build: local Chrome with
// --enable-features=WebMCPTesting (or chrome://flags/#enable-webmcp-testing).
//
// Security note (per Playwright docs): tool names, descriptions, schemas and
// results are provided by the page, so treat them as untrusted input.
(function () {
  function register() {
    if (!window.document || !document.modelContext || typeof document.modelContext.registerTool !== 'function') {
      return; // WebMCP not supported by this browser/context; classic locators still apply.
    }

    // Tool 1 (read-only): read the result box of a lab section.
    document.modelContext.registerTool({
      name: 'lab_read_result',
      title: 'Read lab section result',
      description: 'Returns the visible result-box text for a UI Testing Lab section (e.g. "login" reads #login-result). Read-only; does not modify the page.',
      inputSchema: {
        type: 'object',
        properties: {
          section: { type: 'string', description: 'Section key, e.g. login, checkboxes, dropdown' }
        },
        required: ['section']
      },
      annotations: { readOnlyHint: true },
      execute: async ({ section }) => {
        const el = document.getElementById(section + '-result');
        if (!el) return JSON.stringify({ ok: false, error: 'unknown section: ' + section });
        return JSON.stringify({ ok: true, section, result: el.textContent.trim() });
      }
    }).catch(() => {});

    // Tool 2 (consequential): drive the Form Authentication section via app logic.
    document.modelContext.registerTool({
      name: 'lab_login',
      title: 'Perform lab login',
      description: 'Fills the Form Authentication inputs and invokes the page handleLogin() function, then returns the #login-result text. Mirrors a real user login.',
      inputSchema: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          password: { type: 'string' }
        },
        required: ['username', 'password']
      },
      annotations: { readOnlyHint: false, consequentialHint: true },
      execute: async ({ username, password }) => {
        const userEl = document.getElementById('login-username');
        const passEl = document.getElementById('login-password');
        if (!userEl || !passEl || typeof handleLogin !== 'function') {
          return JSON.stringify({ ok: false, error: 'login section not available' });
        }
        userEl.value = username;
        passEl.value = password;
        handleLogin();
        const result = document.getElementById('login-result').textContent.trim();
        return JSON.stringify({ ok: true, result });
      }
    }).catch(() => {});

    // Shared snapshot helper for the Sortable Data Tables section.
    function snapshotTables() {
      var rows = Array.prototype.map.call(
        document.querySelectorAll('#sort-table-body tr'),
        function (tr) {
          return Array.prototype.map.call(tr.cells, function (td) {
            return td.textContent.trim();
          });
        }
      );
      var resultEl = document.getElementById('table-result');
      return {
        rows: rows,
        names: rows.map(function (r) { return r[1]; }),
        rowCount: rows.length,
        result: resultEl ? resultEl.textContent.trim() : ''
      };
    }

    // Tool 3 (read-only): current sortable-table state as structured data.
    document.modelContext.registerTool({
      name: 'tables_read_state',
      title: 'Read sortable table state',
      description: 'Returns the current rows of the Sortable Data Tables section as structured data (id, name, email, department, status) plus the #table-result text. Read-only; does not modify the page.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: async () => {
        const snap = snapshotTables();
        return JSON.stringify({ ok: true, rowCount: snap.rowCount, names: snap.names, rows: snap.rows, result: snap.result });
      }
    }).catch(() => {});

    // Tool 4 (consequential): sort the table by column index via app logic.
    document.modelContext.registerTool({
      name: 'tables_sort',
      title: 'Sort the data table',
      description: 'Sorts the Sortable Data Tables section by zero-based column index (0=id, 1=name, 2=email, 3=department, 4=status) by invoking the page sortTable() function, then returns the #table-result text and the first row. Mirrors clicking a column header.',
      inputSchema: {
        type: 'object',
        properties: { column: { type: 'integer', minimum: 0, maximum: 4 } },
        required: ['column']
      },
      annotations: { readOnlyHint: false, consequentialHint: true },
      execute: async ({ column }) => {
        if (typeof sortTable !== 'function') {
          return JSON.stringify({ ok: false, error: 'sortable table not available' });
        }
        sortTable(column);
        const snap = snapshotTables();
        return JSON.stringify({ ok: true, result: snap.result, firstRow: (snap.rows[0] || []).join(' | ') });
      }
    }).catch(() => {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', register, { once: true });
  } else {
    register();
  }
})();

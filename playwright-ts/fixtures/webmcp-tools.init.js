// Framework-owned WebMCP registration for the UI Testing Lab POC.
// Loaded via page.addInitScript() BEFORE navigation (see pages/tables.page.ts).
// No-op on browsers without document.modelContext; the specs skip there.
//
// Verified 2026-10-14 on Chrome 154 + --enable-features=WebMCPTesting.
// Quirk on that build: executeTool expects input arguments as a JSON string.
//
// Security note (per Playwright docs): tool names, descriptions, schemas and
// results are provided by the page, so treat them as untrusted input.
(function () {
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

  function register() {
    if (!window.document || !document.modelContext || typeof document.modelContext.registerTool !== 'function') {
      return; // WebMCP not supported by this browser/context; classic locators still apply.
    }

    // Read-only: current sortable-table state as structured data.
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

    // Action: sort the table by column index via the app's own sortTable().
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

import { test, expect } from '../../fixtures/test.fixture';
import { TablesPage } from '../../pages/tables.page';

/**
 * WebMCP POC on the UI Testing Lab "Sortable Data Tables" section.
 *
 * Runs on the `chromium-webmcp` project (flagged Chrome exposing
 * document.modelContext). Skips deterministically on other projects.
 *
 * Traceability: ui-test-lab scripts.js sortTable() and the 2026-10-14
 * WebMCP verification (tools offered, JSON-string executeTool input,
 * "Sorted by column 4 (ascending)" for Department).
 */
test.describe('WebMCP Sortable Data Tables', () => {
    test('discovers the tables WebMCP tools', async ({ page }) => {
        const tablesPage = new TablesPage(page);
        await tablesPage.openTablesSection();
        test.skip(!(await tablesPage.supportsWebMcp()), 'requires flagged Chromium (chromium-webmcp project)');

        const names = await tablesPage.discoverWebmcpTools();
        expect(names).toContain('tables_sort');
        expect(names).toContain('tables_read_state');
    });

    test('sorts by Department via WebMCP identically to classic interaction', async ({ page }) => {
        const tablesPage = new TablesPage(page);
        await tablesPage.openTablesSection();
        test.skip(!(await tablesPage.supportsWebMcp()), 'requires flagged Chromium (chromium-webmcp project)');

        const viaTool = await tablesPage.sortViaWebmcp(3);
        expect(viaTool.ok).toBe(true);
        expect(viaTool.result).toBe('Sorted by column 4 (ascending)');
        const toolOrder = await tablesPage.rowTexts();
        expect(toolOrder[0]).toContain('Charlie Brown');

        await tablesPage.openTablesSection();
        await tablesPage.sortClassicDepartment();
        expect(await tablesPage.resultText()).toBe('Sorted by column 4 (ascending)');
        expect(await tablesPage.rowTexts()).toEqual(toolOrder);
    });

    test('reads table state via WebMCP matching the DOM', async ({ page }) => {
        const tablesPage = new TablesPage(page);
        await tablesPage.openTablesSection();
        test.skip(!(await tablesPage.supportsWebMcp()), 'requires flagged Chromium (chromium-webmcp project)');

        const state = await tablesPage.readStateViaWebmcp();
        expect(state.ok).toBe(true);
        expect(state.rowCount).toBe(5);
        expect(state.names).toEqual(['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Eve Davis']);

        await expect(tablesPage.rows).toHaveCount(5);
    });
});

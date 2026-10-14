import { Locator, Page } from '@playwright/test';
import * as path from 'path';
import { BasePage } from './base.page';
import { logger } from '../utils/logger';

/**
 * SUT-specific page object for the UI Testing Lab "Sortable Data Tables"
 * section, extended with WebMCP tool access for the POC.
 * Follows templates/page-object.template.ts conventions.
 */
const INIT_SCRIPT = path.resolve(__dirname, '../fixtures/webmcp-tools.init.js');

interface WebMcpToolDescriptor {
    name: string;
}

interface TablesSortResult {
    ok: boolean;
    result: string;
    firstRow: string;
    error?: string;
}

interface TablesStateResult {
    ok: boolean;
    rowCount: number;
    names: string[];
    rows: string[][];
    result: string;
}

export class TablesPage extends BasePage {
    readonly tablesNavLink: Locator;
    readonly table: Locator;
    readonly rows: Locator;
    readonly result: Locator;

    constructor(page: Page) {
        super(page);
        this.tablesNavLink = page.locator('#sidebar').getByText('Sortable Data Tables', { exact: true });
        this.table = page.locator('#sort-table');
        this.rows = page.locator('#sort-table-body tr');
        this.result = page.locator('#table-result');
    }

    async openTablesSection(): Promise<void> {
        await this.page.addInitScript({ path: INIT_SCRIPT });
        await this.navigate('/playwright-ui-testing-lab.html');
        await this.clickElement(this.tablesNavLink);
        await this.expectToBeVisible(this.table);
    }

    async departmentHeader(): Promise<Locator> {
        return this.page.getByRole('columnheader', { name: /Department/ });
    }

    async sortClassicDepartment(): Promise<void> {
        await this.clickElement(await this.departmentHeader());
    }

    async rowTexts(): Promise<string[]> {
        return this.rows.allInnerTexts();
    }

    async resultText(): Promise<string> {
        return (await this.result.innerText()).trim();
    }

    async supportsWebMcp(): Promise<boolean> {
        return this.page.evaluate(
            () => typeof (document as unknown as { modelContext?: unknown }).modelContext !== 'undefined',
        );
    }

    async discoverWebmcpTools(): Promise<string[]> {
        logger.info('Discovering WebMCP tools via document.modelContext.getTools()');
        return this.page.evaluate(() =>
            (
                document as unknown as {
                    modelContext: { getTools(): Promise<WebMcpToolDescriptor[]> };
                }
            ).modelContext
                .getTools()
                .then((tools) => tools.map((t) => t.name)),
        );
    }

    private async executeWebmcpTool(name: string, inputJson: string): Promise<string> {
        logger.info(`Executing WebMCP tool: ${name}`);
        return this.page.evaluate(
            ({ toolName, input }: { toolName: string; input: string }) => {
                const ctx = (
                    document as unknown as {
                        modelContext: {
                            getTools(): Promise<WebMcpToolDescriptor[]>;
                            executeTool(tool: WebMcpToolDescriptor, args: string): Promise<string>;
                        };
                    }
                ).modelContext;
                // NOTE: this Chromium build expects executeTool input as a JSON
                // string; a plain object fails with "Failed to parse input arguments".
                return ctx.getTools().then((tools) => {
                    const tool = tools.find((t) => t.name === toolName);
                    if (!tool) {
                        throw new Error(`${toolName} not registered`);
                    }
                    return ctx.executeTool(tool, input);
                });
            },
            { toolName: name, input: inputJson },
        );
    }

    async sortViaWebmcp(column: number): Promise<TablesSortResult> {
        const raw = await this.executeWebmcpTool('tables_sort', JSON.stringify({ column }));
        return JSON.parse(raw) as TablesSortResult;
    }

    async readStateViaWebmcp(): Promise<TablesStateResult> {
        const raw = await this.executeWebmcpTool('tables_read_state', JSON.stringify({}));
        return JSON.parse(raw) as TablesStateResult;
    }
}

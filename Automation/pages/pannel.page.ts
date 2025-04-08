import { Page, Locator, expect } from '@playwright/test';

export class PanelPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get searchInput() {
        return this.page.locator('[data-test="index-field-search-input"]');
    }

    get clearButton() {
        return this.page.getByRole('button', { name: 'Clear' });
    }

    getYDataButton(fieldName: string) {
        return this.page.locator(`[data-test="field-list-item-logs-default-${fieldName}"] [data-test="dashboard-add-y-data"]`);
    }

    getXDataButton(fieldName: string) {
        return this.page.locator(`[data-test="field-list-item-logs-default-${fieldName}"] [data-test="dashboard-add-x-data"]`);
    }

    get applyButton() {
        return this.page.locator('[data-test="dashboard-apply"]');
    }

    //   get dateTimeBtn() {
    //     return this.page.locator('[data-test="date-time-btn"]');
    //   }

    get dateTimeBtn() {
        return this.page.getByRole('button', { name: /Past \d+ Minutes/i });
    }

    get relative1MonthBtn() {
        return this.page.locator('[data-test="date-time-relative-1-M-btn"]');
    }

    get chartTypeIcon() {
        return this.page.locator('[data-test="selected-chart-line-item"] img');
    }

    get removeTimestampXItem() {
        return this.page.locator('[data-test="dashboard-x-item-_timestamp-remove"]');
    }

    get panelTitle() {
        return this.page.locator('[data-test="dashboard-panel-title"]');
    }

    get panelNameInput() {
        return this.page.locator('[data-test="dashboard-panel-name"]');
    }

    get editPanelButton() {
        return this.page.locator('[data-test="dashboard-edit-panel"]');
    }

    get sidebarButton() {
        return this.page.locator('[data-test="dashboard-sidebar"]');
    }

    get connectNullValuesToggle() {
        // nth(2) clicks the switch/toggle part inside the div
        return this.page.locator('[data-test="dashboard-config-connect-null-values"] div').nth(2);
    }



    // Methods

    async removeDefaultXItem() {
        if (await this.removeTimestampXItem.isVisible()) {
            await this.removeTimestampXItem.click();
        }
    }

    async searchField(fieldName: string) {
        await this.searchInput.click();
        await this.searchInput.fill(fieldName);
    }

    async addFieldToAxis(fieldName: string, axis: 'x' | 'y') {
        await this.searchField(fieldName);
        if (axis === 'y') {
            await this.getYDataButton(fieldName).click();
        } else {
            await this.getXDataButton(fieldName).click(); // updated call
        }
        await this.clearButton.click();
    }

    async addMultipleFields(fields: string[], axis: 'x' | 'y') {
        for (const field of fields) {
            await this.addFieldToAxis(field, axis);
        }
    }

    async applyPanel() {
        await this.applyButton.click();
    }

    async setRelativeTimeFilter(period: string = '1-M') {
        await this.dateTimeBtn.click();
        const selector = `[data-test="date-time-relative-${period}-btn"]`;
        await this.page.locator(selector).click();
    }

    async selectChartType(type: 'line' | 'bar' | 'pie' = 'line') {
        const chartSelector = `[data-test="selected-chart-${type}-item"] img`;
        await this.page.locator(chartSelector).click();
    }

    async verifyChartLoaded() {
        try {
            const chartCanvas = this.page.locator('#chart1');
            await expect(chartCanvas).toBeVisible({ timeout: 5000 });
        } catch (error) {
            console.error('Chart not loaded: ', error);
            throw error;
        }
    }

    async setPannelName(pannelName: string) {
        await this.panelNameInput.fill(pannelName);
    }

    async savePannel() {
        await this.page.locator('[data-test="dashboard-panel-save"]').click();
    }

    getEditDropdownByName(panelName: string) {
        return this.page.locator(`[data-test="dashboard-edit-panel-${panelName}-dropdown"]`);
    }

    async editPanel(panelName: string) {
        await this.getEditDropdownByName(panelName).click();
        await this.editPanelButton.click();
    }

    async toggleConnectNullValues() {
        await this.sidebarButton.click();
        await this.connectNullValuesToggle.click();
        await this.applyButton.click();
    }

    async isConnectNullValuesEnabled(): Promise<boolean> {
        await this.sidebarButton.click();
        const state = await this.connectNullValuesToggle.getAttribute('aria-checked');
        return state === 'true';
    }

    async ensureConnectNullValuesEnabled() {
        const isEnabled = await this.isConnectNullValuesEnabled();
        if (!isEnabled) {
            await this.connectNullValuesToggle.click();
            await this.applyButton.click();
        }
    }

}

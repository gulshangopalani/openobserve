import { Locator, Page, expect } from '@playwright/test';
import { PanelPage } from './pannel.page';

export class DashboardPage {

    readonly logo: Locator;

    constructor(private page: Page) {
        this.logo = page.locator('img.appLogo');
    }

    async verifyAppLogo() {
        await expect(this.logo).toBeVisible();
        await expect(this.logo).toHaveAttribute('src', /open_observe_logo\.svg/);
    }

    async clickDashboardMenu() {
        await this.page.locator('[data-test="menu-link-\\/dashboards-item"]').click();
    }

    async createFolder(folderName: string) {
        await this.page.getByRole('button', { name: 'New Folder' }).click();
        await this.page.locator('[data-test="dashboard-folder-add-name"]').fill(folderName);
        await this.page.locator('[data-test="dashboard-folder-add-save"]').click();
        await this.page.waitForLoadState('networkidle');
    }

    async createDashboard(dashboardName: string, folderName: string) {
        await this.page.locator('[data-test="dashboard-add"]').click();
        await this.page.locator('[data-test="add-dashboard-name"]').fill(dashboardName);
        await this.page.locator('[data-test="index-dropdown-stream_type"]').click();
        await this.page.getByRole('option', { name: folderName }).locator('span').click();
        await this.page.locator('[data-test="dashboard-add-submit"]').click();
        await this.page.waitForSelector(`text=${dashboardName}`);
    }

    async openAddPanel(): Promise<PanelPage> {
        await this.page.locator('[data-test="dashboard-if-no-panel-add-panel-btn"]').click();
        await this.page.waitForLoadState('networkidle');
        return new PanelPage(this.page);
    }


    async deleteDashboard(folderName: string, dashboardName: string, panelName?: string) {

        // Optional: Delete panel if name provided
        if (panelName) {
            const panelDropdown = `[data-test="dashboard-edit-panel-${panelName}-dropdown"]`;
            await this.page.locator(panelDropdown).click();
            await this.page.locator('[data-test="dashboard-delete-panel"]').click();
            await this.page.locator('[data-test="confirm-button"]').click();
        }

        // Navigate to dashboard
        await this.page.getByText('Start by adding your first dashboard panel', { exact: false }).click();
        await this.page.getByText(folderName, { exact: false }).click();
        await this.page.getByRole('cell', { name: new RegExp(dashboardName, 'i') }).click();
        await this.page.getByText(folderName, { exact: false }).click();
        await this.page.getByRole('cell', { name: new RegExp(dashboardName, 'i') }).click();
        await this.page.getByText(dashboardName, { exact: false }).click();

        // Go back and click on the folder by name
        await this.page.locator('[data-test="dashboard-back-btn"]').click();
        await this.page.getByText(folderName, { exact: false }).click();

        // Delete the dashboard inside the folder (if it exists)
        const deleteBtn = this.page.locator('[data-test="dashboard-delete"]');
        if (await deleteBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await deleteBtn.click();
            await this.page.locator('[data-test="confirm-button"]').click();
            await this.page.getByText('Dashboard deleted').waitFor({ timeout: 3000 });
        }

        // Locate folder tab
        const folderTab = this.page.locator('[data-test^="dashboard-folder-tab-"]', {
            hasText: folderName,
        });
        await folderTab.scrollIntoViewIfNeeded();
        await folderTab.click(); // Ensure it’s selected/expanded

        // Locate and attempt to click the more icon
        const moreIcon = folderTab.locator('[data-test="dashboard-more-icon"]');

        if (await moreIcon.isVisible({ timeout: 3000 }).catch(() => false)) {
            try {
                await moreIcon.scrollIntoViewIfNeeded();
                await moreIcon.hover();
                await moreIcon.click();
            } catch (err) {
                console.warn('Direct click failed, trying bounding box click...');
                const box = await moreIcon.boundingBox();
                if (box) {
                    await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
                } else {
                    throw new Error('Failed to locate more icon bounding box');
                }
            }
        } else {
            throw new Error(`More icon for folder "${folderName}" is not visible`);
        }

        // Step 5: Delete option
        const deleteOption = this.page.getByText('Delete', { exact: true });
        if (await deleteOption.isVisible({ timeout: 1000 }).catch(() => false)) {
            await deleteOption.click();
        }

        // Step 6: Confirm deletion
        await this.page.locator('[data-test="confirm-button"]').click();
        await expect(this.page.getByText('Folder deleted successfully.')).toBeVisible({ timeout: 3000 });
    }
}

import { Page } from '@playwright/test';

export class FolderPage {
  constructor(private page: Page) {}

  async createFolder(folderName: string) {
    await this.page.click('button#create-folder');
    await this.page.fill('input#folder-name', folderName);
    await this.page.click('button#save-folder');
    await this.page.waitForSelector(`text=${folderName}`);
  }
}

import { Page, Locator } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string) {
    await this.page.goto(path);
  }

  getByTest(testId: string): Locator {
    return this.page.locator(`[data-test="${testId}"]`);
  }

  getByRole(role: string, name?: string): Locator {
    return this.page.getByRole(role as any, { name });
  }
}

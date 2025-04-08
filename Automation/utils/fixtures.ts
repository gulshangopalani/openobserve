// fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './../pages/login.page';
import { DashboardPage } from './../pages/dashboard.page';
import { testData } from './testData';

type MyFixtures = {
  dashboardPage: DashboardPage;
};

export const test = base.extend<MyFixtures>({
  dashboardPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(testData.login.url);

    const dashboard = await loginPage.login(testData.login.username, testData.login.password);
    await use(dashboard); 
  },
});

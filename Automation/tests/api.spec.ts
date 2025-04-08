import { test, expect, request, APIRequestContext } from '@playwright/test';
import { testData } from '../utils/testData';

let apiContext: APIRequestContext;

test.describe('Login API & Dashboard Test', () => {
    test.beforeAll(async ({ playwright }) => {
        apiContext = await playwright.request.newContext();
    });

    test('Login and create dashboard via API', async () => {
        // LOGIN API
        const loginResponse = await apiContext.post(`${testData.login.uri}auth/login`, {
            data: {
                name: testData.login.username,
                password: testData.login.password,
            },
        });

        expect(loginResponse.status()).toBe(200);
        const loginBody = await loginResponse.json();
        expect(loginBody).toHaveProperty('status', true);

        //  FOLDER NAME (fallback to default)
        const folderName = 'default';

        // DASHBOARD PAYLOAD
        const payload = {
            title: `API_Dashboard-${Date.now()}`,
            dashboardId: "",
            description: "",
        };

        // API ENDPOINT
        const endpoint = `${testData.login.uri}api/default/dashboards?folder=${encodeURIComponent(folderName)}`;

        //POST DASHBOARD
        const dashboardResponse = await apiContext.post(endpoint, {
            data: payload,
        });

        const responseText = await dashboardResponse.text();

        expect(dashboardResponse.status()).toBe(200);

        const dashboardBody = JSON.parse(responseText);

        expect(dashboardBody.v1).toHaveProperty('dashboardId');
        expect(dashboardBody.v1.title).toBe(payload.title);

        console.log("Dashboard Created:", dashboardBody.dashboardId);
    });
});

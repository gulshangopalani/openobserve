import { test } from './../utils/fixtures';


test('test', async ({ dashboardPage  }) => {
  test.setTimeout(120000);
  await dashboardPage.verifyAppLogo();
  await dashboardPage.clickDashboardMenu();

  const folderName = `AutoFolder-${Date.now()}`;
  await dashboardPage.createFolder(folderName);

  const dashboardName = `AutoDashboard-${Date.now()}`;
  await dashboardPage.createDashboard(dashboardName,folderName);
  const panelPage = await dashboardPage.openAddPanel();

  const panneLName = `AutoPannelName-${Date.now()}`;
  await panelPage.setPannelName(panneLName);

  await panelPage.selectChartType('line');
  await panelPage.removeDefaultXItem();
  const yFields = ['method', '_timestamp','kubernetes_annotations_kubernetes_io_psp'];
  const xFields = ['code'];

  await panelPage.addMultipleFields(yFields, 'y');
  await panelPage.addMultipleFields(xFields, 'x');

  await panelPage.setRelativeTimeFilter('1-M');
  
  await panelPage.applyPanel();

  await panelPage.verifyChartLoaded();

  await panelPage.savePannel();
  await panelPage.editPanel(panneLName);
  await panelPage.ensureConnectNullValuesEnabled();
  await panelPage.setRelativeTimeFilter('1-M');
  await panelPage.applyPanel();
  await panelPage.verifyChartLoaded();
  await panelPage.savePannel();
  await dashboardPage.deleteDashboard(folderName, dashboardName, panneLName);
});
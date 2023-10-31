import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";

export const widgetIds = {
    viewerDashboard: 'viewerDashboard',
}


export const widget1 = () => ({
    id: widgetIds.viewerDashboard,
    name: "Visualizer",
    component: widgetIds.viewerDashboard,
    panelName: "leftPanel",
    enableClose: false,
    status: WidgetStatus.ACTIVE,
});

import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";

export const widgetIds = {
    viewerDashboard: 'viewerDashboard',
    metadataViewer: 'metadataViewer',
}


export const widget1 = () => ({
    id: widgetIds.viewerDashboard,
    name: "Visualizer",
    component: widgetIds.viewerDashboard,
    panelName: "leftPanel",
    enableClose: false,
    status: WidgetStatus.ACTIVE,
});

export const widget2 = () => ({
    id: widgetIds.metadataViewer,
    name: "Experiment details",
    component: widgetIds.metadataViewer,
    panelName: "rightPanel",
    enableClose: false,
    status: WidgetStatus.ACTIVE,
});

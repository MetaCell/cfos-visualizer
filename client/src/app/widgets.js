import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";


export const widget1 = () => ({
    id: "myComponentID",
    name: "Widget 1 Name",
    component: "myComponent",
    panelName: "rightPanel",
    enableClose: false,
    status: WidgetStatus.ACTIVE,
});

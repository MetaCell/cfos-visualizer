import { ViewerDashboard } from '../components/ViewerDashboard';
import { MetadataViewer } from '../components/MetadataViewer';
import {widgetIds} from "./widgets";

/**
 * Key of the component is the `component` attribute of the widgetConfiguration.
 * 
 * This map is used inside the LayoutManager to know which component to display for a given widget.
 */
const componentMap = {
    [widgetIds.viewerDashboard]: ViewerDashboard,
    [widgetIds.metadataViewer]: MetadataViewer,
};

export default componentMap

import {
    fetchActivityMapStack,
    fetchAtlasStack,
    fetchAtlasWireframeStack,
    fetchExperimentMetadata, fetchLUTFile,
    fetchModelStructure
} from "../services/fetchService";
import {
    triggerDownloadAllObjects,
    triggerViewerObjectDownload,
    setCurrentExperiment,
    setError,
    setModel,
    addActivityMapToViewer, setViewerAtlas
} from "./actions";
import {actions} from "./constants";
import {Experiment, ActivityMap, ViewerObjectType, Atlas} from "../model/models";
import {DEFAULT_COLOR, DEFAULT_OPACITY, DEFAULT_VISIBILITY} from "../settings";
import {downloadActivityMap, downloadAllViewerObjects, downloadAtlas} from "../services/downloadService";

export const middleware = store => next => async action => {

    switch (action.type) {
        case actions.FETCH_MODEL:
            let model = null
            let fetchedLuts = null
            try {
                model = await fetchModelStructure();

                const lutPromises = model.luts.map(async lutID => {
                    const lutData = await fetchLUTFile(lutID);
                    return { lutID, lutData };
                });

                fetchedLuts = await Promise.all(lutPromises);
            } catch (error) {
                store.dispatch(setError(error.message));
                return
            }
            const lutsMap = fetchedLuts.reduce((acc, { lutID, lutData }) => {
                acc[lutID] = lutData;
                return acc;
            }, {});

            store.dispatch(setModel({ ...model, luts: lutsMap }));
            break;

        case actions.FETCH_AND_SET_CURRENT_EXPERIMENT_AND_ATLAS:
            const { experimentID, atlasID } = action.payload;
            let data = null
            try {
                data = await fetchExperimentMetadata(experimentID);
            } catch (error) {
                store.dispatch(setError(error.message));
                return
            }

            let atlasStack = null
            let atlasWireframeStack = null
            try {
                atlasStack = await fetchAtlasStack(atlasID);
            } catch (error) {
                store.dispatch(setError(error.message));
                return
            }
            try {
                atlasWireframeStack = await fetchAtlasWireframeStack(atlasID);
            } catch (error) {
                store.dispatch(setError(error.message));
                return
            }

            const atlas = new Atlas(
                atlasID,
                DEFAULT_COLOR,
                DEFAULT_OPACITY,
                DEFAULT_VISIBILITY,
                atlasStack,
                atlasWireframeStack
            );

            store.dispatch(setCurrentExperiment(new Experiment(experimentID, data)));
            store.dispatch(setViewerAtlas(atlas));
            break;

        case actions.FETCH_AND_ADD_ACTIVITY_MAP_TO_VIEWER:
            const activityMapID = action.payload;
            let stack = null
            try {
                stack = await fetchActivityMapStack(activityMapID);
            } catch (error) {
                store.dispatch(setError(error.message));
                return
            }

            const activityMapObject = new ActivityMap(
                activityMapID,
                DEFAULT_COLOR,
                DEFAULT_OPACITY,
                DEFAULT_VISIBILITY,
                stack,
            );
            store.dispatch(addActivityMapToViewer(activityMapObject));
            break;

        case actions.DOWNLOAD_VIEWER_OBJECT:
            const viewerState = store.getState().viewer
            const activityMap = viewerState.activityMaps[action.payload];
            if (activityMap) {
                try{
                    await downloadActivityMap(action.payload);
                }
                catch (error) {
                    store.dispatch(setError(error.message));
                }
            } else if (viewerState.atlas && viewerState.atlas.id === action.payload) {
                try {
                    await downloadAtlas(action.payload);
                } catch (error) {
                    store.dispatch(setError(error.message));
                }
            } else {
                store.dispatch(setError(`Object with ID ${action.payload} not found`));
            }
            break;

        case actions.DOWNLOAD_ALL_OBJECTS:
            const allActivityMapsIDs = Object.keys(store.getState().viewer.activityMaps);

            try {
                await downloadAllViewerObjects(allActivityMapsIDs, store.getState().viewer.atlas.id);
            }catch (error) {
                store.dispatch(setError(error.message));
            }
            break;
        default:
            next(action);
    }


};
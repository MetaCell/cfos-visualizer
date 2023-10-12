
import {
    fetchActivityMapStack,
    fetchAtlasStack,
    fetchAtlasWireframeStack,
    fetchExperimentMetadata, fetchLUTFile,
    fetchModelStructure
} from "../services/fetchService";
import {
    setCurrentExperiment,
    setError,
    setModel,
    addActivityMapToViewer, setViewerAtlas, fetchAndSetExperimentAndAtlas, startLoading, stopLoading
} from "./actions";
import {actions} from "./constants";
import {Experiment, ActivityMap, Atlas} from "../model/models";
import {DEFAULT_COLOR_GRADIENT, DEFAULT_ATLAS_OPACITY, DEFAULT_VISIBILITY, DEFAULT_ACTIVITY_MAP_OPACITY} from "../settings";
import {downloadActivityMap, downloadAllViewerObjects, downloadAtlas} from "../services/downloadService";
import {getColorGradient} from "../helpers/colorHelper";

export const middleware = store => next => async action => {

    switch (action.type) {
        case actions.FETCH_MODEL:
            let model = null
            // let fetchedLuts = null

            try {
                store.dispatch(startLoading('Fetching model...'))
                model = await fetchModelStructure();

                // TODO: to be added later @afonsobspinto

                // const lutPromises = model.luts.map(async lutID => {
                //     const lutData = await fetchLUTFile(lutID);
                //     return { lutID, lutData };
                // });
                //
                // fetchedLuts = await Promise.all(lutPromises);
            } catch (error) {
                store.dispatch(setError(error.message));
                store.dispatch(stopLoading());
                return
            }
            // const lutsMap = fetchedLuts.reduce((acc, { lutID, lutData }) => {
            //     acc[lutID] = lutData;
            //     return acc;
            // }, {});

            store.dispatch(setModel({ ...model, Luts: {} }));

            // Extract default experimentID and atlasID
            const experimentAtlasEntries = Object.entries(model.ExperimentsAtlas);
            if (experimentAtlasEntries.length > 0) {
                const experimentID = experimentAtlasEntries[0][0];
                const atlasEntries = experimentAtlasEntries[0][1];
                if (atlasEntries.length > 0) {
                    const atlasID = atlasEntries[0];
                    store.dispatch(fetchAndSetExperimentAndAtlas(experimentID, atlasID));
                }else{
                    store.dispatch(stopLoading());
                }
            }

            break;

        case actions.FETCH_AND_SET_CURRENT_EXPERIMENT_AND_ATLAS:
            const { experimentID, atlasID } = action.payload;
            const currentExperiment = store.getState().currentExperiment;
            const currentAtlas = store.getState().viewer.atlas;

            if (currentExperiment?.id !== experimentID) {
                let data = null
                try {
                    store.dispatch(startLoading('Fetching experiment metadata...'))
                    data = await fetchExperimentMetadata(experimentID);
                } catch (error) {
                    store.dispatch(setError(error.message));
                    return
                }
                store.dispatch(setCurrentExperiment(new Experiment(experimentID, data)));
            }

            if (currentAtlas?.id !== atlasID) {
                let atlasStack = null;
                let atlasWireframeStack = null;
                let atlasMetadata = store.getState().model.Atlases[atlasID]
                if(!atlasMetadata){
                    store.dispatch(setError(`Atlas id ${atlasID} not found`));
                    store.dispatch(stopLoading());
                }
                try {
                    store.dispatch(startLoading('Fetching atlas...'));
                    atlasStack = await fetchAtlasStack(atlasMetadata.file);
                } catch (error) {
                    store.dispatch(setError(error.message));
                    store.dispatch(stopLoading());
                    return;
                }
                // TODO: uncomment when we get the wireframe version of the atlas
                // try {
                //     atlasWireframeStack = await fetchAtlasWireframeStack(atlasID);
                // } catch (error) {
                //     store.dispatch(setError(error.message));
                //     return;
                // }

                const atlas = new Atlas(
                    atlasID,
                    DEFAULT_ATLAS_OPACITY,
                    DEFAULT_VISIBILITY,
                    atlasStack,
                    atlasWireframeStack
                );
                store.dispatch(setViewerAtlas(atlas));
            }
            store.dispatch(stopLoading());
            break;

        case actions.FETCH_AND_ADD_ACTIVITY_MAP_TO_VIEWER:
            store.dispatch(startLoading('Fetching activity map...'))
            const activityMapID = action.payload;
            let stack = null
            let activityMapMetadata = store.getState().model.ActivityMaps[activityMapID]
            if(!activityMapMetadata){
                store.dispatch(setError(`Activity Map id ${activityMapID} not found`));
                store.dispatch(stopLoading());
            }
            try {
                stack = await fetchActivityMapStack(activityMapMetadata?.file);
            } catch (error) {
                store.dispatch(setError(error.message));
                store.dispatch(stopLoading());
                return
            }

            const activityMapObject = new ActivityMap(
                activityMapID,
                activityMapMetadata.color ? getColorGradient(activityMapMetadata.color) : DEFAULT_COLOR_GRADIENT,
                DEFAULT_ACTIVITY_MAP_OPACITY,
                DEFAULT_VISIBILITY,
                stack,
            );
            store.dispatch(addActivityMapToViewer(activityMapObject));
            store.dispatch(stopLoading());
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
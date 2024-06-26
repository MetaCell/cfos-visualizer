import {
    fetchActivityMapStack,
    fetchAtlasStack,
    fetchAtlasWireframeStack,
    fetchExperimentMetadata, fetchExperimentsMetadata, fetchLUTFile,
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
import {
    DEFAULT_COLOR_RANGE, DEFAULT_IS_INTENSITY_RANGE_INCLUSIVE,
    DEFAULT_VISIBILITY, INTENSITY_VALUE_ERROR,
} from "../settings";
import {downloadActivityMap, downloadAllViewerObjects, downloadAtlas} from "../services/downloadService";

export const middleware = store => next => async action => {

    switch (action.type) {
        case actions.FETCH_MODEL:
            let model = null
            let lut = {}
            let metadata = {}

            try {
                store.dispatch(startLoading('Fetching model...'))
                model = await fetchModelStructure();

            } catch (error) {
                store.dispatch(setError(error.message));
                store.dispatch(stopLoading());
                return
            }

            try {
                store.dispatch(startLoading('Fetching look up table...'))
                lut = await fetchLUTFile();
            } catch (error) {
                store.dispatch(setError(error.message));
                store.dispatch(stopLoading());
                return
            }

            try {
                store.dispatch(startLoading('Fetching experiments metadata...'))
                metadata = await fetchExperimentsMetadata();
            } catch (error) {
                store.dispatch(setError(error.message));
                store.dispatch(stopLoading());
                return
            }

            store.dispatch(setModel({...model, Lut: lut, ExperimentsMetadata: metadata}));

            // Extract default experimentID and atlasID
            const experimentAtlasEntries = Object.entries(model.ExperimentsAtlas);
            if (experimentAtlasEntries.length > 0) {
                const experimentID = experimentAtlasEntries[0][0];
                const atlasEntries = experimentAtlasEntries[0][1];
                if (atlasEntries.length > 0) {
                    const atlasID = atlasEntries[0];
                    store.dispatch(fetchAndSetExperimentAndAtlas(experimentID, atlasID));
                } else {
                    store.dispatch(stopLoading());
                }
            }

            break;

        case actions.FETCH_AND_SET_CURRENT_EXPERIMENT_AND_ATLAS:
            const {experimentID, atlasID} = action.payload;
            const currentExperiment = store.getState().currentExperiment;
            const currentAtlas = store.getState().viewer.atlas;
            const {ExperimentsMetadata, Atlases} = store.getState().model;


            if (currentExperiment?.id !== experimentID) {
                let experimentMetadata = ExperimentsMetadata[experimentID];
                if (!experimentMetadata) {
                    console.warn(`Metadata for experiment ${experimentID} not found.`);
                    store.dispatch(setError(`Metadata for experiment id ${experimentID} not found`));
                }
                store.dispatch(setCurrentExperiment(new Experiment(experimentID, experimentMetadata)));
            }

            if (currentAtlas?.id !== atlasID) {
                let atlasStack = null;
                let atlasWireframeStack = null;
                let atlasMetadata = Atlases[atlasID]
                if (!atlasMetadata) {
                    store.dispatch(setError(`Atlas id ${atlasID} not found`));
                }
                try {
                    store.dispatch(startLoading('Fetching atlas...'));
                    atlasStack = await fetchAtlasStack(atlasMetadata.file);
                } catch (error) {
                    store.dispatch(setError(error.message));
                    store.dispatch(stopLoading());
                    return;
                }

                if (atlasStack.minMax[0] === Infinity) {
                    store.dispatch(setError(INTENSITY_VALUE_ERROR));
                    store.dispatch(stopLoading());
                    return
                }
                try {
                    atlasWireframeStack = await fetchAtlasWireframeStack(atlasMetadata.file);
                } catch (error) {
                    store.dispatch(setError(error.message));
                    return;
                }

                const atlas = new Atlas(
                    atlasID,
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
            if (!activityMapMetadata) {
                store.dispatch(setError(`Activity Map id ${activityMapID} not found`));
                store.dispatch(stopLoading());
            }
            try {
                stack = await fetchActivityMapStack(activityMapMetadata.file);
            } catch (error) {
                store.dispatch(setError(error.message));
                store.dispatch(stopLoading());
                return
            }

            if (stack.minMax[0] === Infinity) {
                store.dispatch(setError(INTENSITY_VALUE_ERROR));
                store.dispatch(stopLoading());
                return
            }

            const activityMapObject = new ActivityMap(
                    activityMapID,
                    DEFAULT_COLOR_RANGE,
                    [...stack.minMax],
                    DEFAULT_IS_INTENSITY_RANGE_INCLUSIVE,
                    DEFAULT_VISIBILITY,
                    stack,
                )
            ;
            store.dispatch(addActivityMapToViewer(activityMapObject));
            store.dispatch(stopLoading());
            break;

        case actions.DOWNLOAD_VIEWER_OBJECT:
            const id = action.payload
            const activityMapMetadataToDownload = store.getState().model.ActivityMaps[id]
            if (activityMapMetadataToDownload) {
                try {
                    await downloadActivityMap(activityMapMetadataToDownload.file);
                } catch (error) {
                    store.dispatch(setError(error.message));
                }
            } else {
                const atlasMetadata = store.getState().model.Atlases[id]
                if (atlasMetadata) {
                    try {
                        await downloadAtlas(atlasMetadata.file);
                    } catch (error) {
                        store.dispatch(setError(error.message));
                    }
                } else {
                    store.dispatch(setError(`Object with ID ${id} not found`));
                }
            }
            break;

        case actions.DOWNLOAD_ALL_OBJECTS:
            const allActivityMapsIDs = Object.keys(store.getState().viewer.activityMaps);

            try {
                await downloadAllViewerObjects(allActivityMapsIDs, store.getState().viewer.atlas.id);
            } catch (error) {
                store.dispatch(setError(error.message));
            }
            break;
        default:
            next(action);
    }


};
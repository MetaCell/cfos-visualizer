
import {
    fetchActivityMapStack,
    fetchAtlasStack,
    fetchAtlasWireframeStack,
    fetchExperimentMetadata, fetchLUTFile,
    fetchModelStructure
} from "../services/fetchService";
import {setCurrentExperiment, setError, setModel, setObjectToViewer} from "./actions";
import {actions} from "./constants";
import {Experiment, ViewerObject, ViewerObjectType} from "../model/models";
import {DEFAULT_COLOR, DEFAULT_OPACITY, DEFAULT_VISIBILITY} from "../settings";

export const middleware = store => next => async action => {

    switch (action.type) {
        case actions.FETCH_MODEL:
            try {
                const data = await fetchModelStructure();

                const lutPromises = data.luts.map(async lutID => {
                    const lutData = await fetchLUTFile(lutID);
                    return { lutID, lutData };
                });

                const fetchedLuts = await Promise.all(lutPromises);

                const lutsMap = fetchedLuts.reduce((acc, { lutID, lutData }) => {
                    acc[lutID] = lutData;
                    return acc;
                }, {});

                store.dispatch(setModel({ ...data, luts: lutsMap }));
            } catch (error) {
                store.dispatch(setError(error.message));
            }
            break;
        case actions.FETCH_CURRENT_EXPERIMENT:
            try {
                const experimentID = action.payload;
                const data = await fetchExperimentMetadata(experimentID);
                store.dispatch(setCurrentExperiment(new Experiment(experimentID, data)));
            } catch (error) {
                store.dispatch(setError(error.message));
            }
            break;
        case actions.ADD_OBJECT_TO_VIEWER:
            const { objectID, type } = action.payload;
            let stack = null;
            let wireframeStack = null
            try {
                if (type === ViewerObjectType.ATLAS) {
                    stack = await fetchAtlasStack(objectID);
                    wireframeStack = await fetchAtlasWireframeStack(objectID);
                } else if (type === ViewerObjectType.ACTIVITY_MAP) {
                    stack = await fetchActivityMapStack(objectID);
                }

                const viewerObject = new ViewerObject(
                    objectID,
                    type,
                    DEFAULT_COLOR,
                    DEFAULT_OPACITY,
                    DEFAULT_VISIBILITY,
                    stack,
                    wireframeStack
                );
                store.dispatch(setObjectToViewer(viewerObject));

            } catch (error) {
                store.dispatch(setError(error.message));
            }
            break;
        default:
            next(action);
    }


};
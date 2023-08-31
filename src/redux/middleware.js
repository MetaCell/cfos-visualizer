
import {fetchExperimentMetadata, fetchModelStructure} from "../services/fetchService";
import {setCurrentExperiment, setError, setModel} from "./actions";
import {actions} from "./constants";
import {Experiment} from "../model/models";

export const middleware = store => next => async action => {

    switch (action.type) {
        case actions.FETCH_MODEL:
            try {
                const data = await fetchModelStructure();
                store.dispatch(setModel(data));
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
        default:
            next(action);
    }


};
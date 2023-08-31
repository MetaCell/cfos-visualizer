
import {fetchModelStructure} from "../services/fetchService";
import {setModelDataFailure, setModelDataSuccess} from "./actions";
import {actions} from "./constants";

export const middleware = store => next => async action => {

    switch (action.type) {
        case actions.FETCH_MODEL_DATA:
            try {
                const data = await fetchModelStructure();
                store.dispatch(setModelDataSuccess(data));
            } catch (error) {
                store.dispatch(setModelDataFailure(error.message));
            }
            break;
        default:
            break;
    }

    next(action);
};
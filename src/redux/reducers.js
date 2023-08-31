import {INIT_STATE} from "./store";
import {actions} from "./constants";


const viewerReducer = (state = INIT_STATE.viewer, action) => {
    switch (action.type) {
        case actions.ADD_OBJECT_TO_VIEWER:
            return {
                ...state,
                objects: {
                    ...state.objects,
                    [action.payload.id]: action.payload
                }
            };
        case actions.REMOVE_OBJECT_FROM_VIEWER:
            const newObjects = { ...state.objects };
            delete newObjects[action.payload];
            return { ...state, objects: newObjects };
        case actions.TOGGLE_OBJECT_VISIBILITY:
            return {
                ...state,
                objects: {
                    ...state.objects,
                    [action.payload]: {
                        ...state.objects[action.payload],
                        visibility: !state.objects[action.payload].visibility
                    }
                }
            };
        case actions.CHANGE_OBJECT_OPACITY:
            return {
                ...state,
                objects: {
                    ...state.objects,
                    [action.payload.objectId]: {
                        ...state.objects[action.payload.objectId],
                        opacity: action.payload.opacity
                    }
                }
            };
        case actions.CHANGE_ALL_OBJECTS_OPACITY:
            const updatedObjects = Object.keys(state.objects).reduce((acc, objectId) => {
                acc[objectId] = {
                    ...state.objects[objectId],
                    opacity: action.payload
                };
                return acc;
            }, {});
            return {
                ...state,
                objects: updatedObjects
            };
        default:
            return state;
    }
};

const currentExperimentReducer = (state = INIT_STATE.currentExperiment, action) => {
    switch (action.type) {
        case actions.SET_CURRENT_EXPERIMENT:
            return action.payload;
        default:
            return state;
    }
};

const modelReducer = (state = INIT_STATE.model, action) => {
    switch (action.type) {
        case actions.FETCH_MODEL_DATA_SUCCESS:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};

const uiReducer = (state = INIT_STATE.ui, action) => {
    switch (action.type) {
        case actions.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };
        case actions.SET_ERROR:
            return {
                ...state,
                errors: action.payload
            };
        default:
            return state;
    }
};

export { viewerReducer, currentExperimentReducer, modelReducer, uiReducer };

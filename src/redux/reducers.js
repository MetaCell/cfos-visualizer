import {INIT_STATE} from "./store";
import {actions} from "./constants";
import {ViewerObject} from "../model/models";


const viewerReducer = (state = INIT_STATE.viewer, action) => {
    switch (action.type) {
        case actions.SET_OBJECT_TO_VIEWER:
            return {
                ...state,
                objects: {
                    ...state.objects,
                    [action.payload.id]: action.payload,
                },
                objectsOrder: [...state.objectsOrder, action.payload.id]
            };

        case actions.REMOVE_OBJECT_FROM_VIEWER:
            const newObjects = { ...state.objects };
            delete newObjects[action.payload];
            const newOrder = state.objectsOrder.filter(id => id !== action.payload);

            return { ...state, objects: newObjects,objectsOrder: newOrder};

        case actions.TOGGLE_OBJECT_VISIBILITY:
            const objectToToggle = state.objects[action.payload];
            return {
                ...state,
                objects: {
                    ...state.objects,
                    [action.payload]: new ViewerObject(
                        objectToToggle.id,
                        objectToToggle.type,
                        objectToToggle.color,
                        objectToToggle.opacity,
                        !objectToToggle.visibility,
                        objectToToggle.stack,
                        objectToToggle.wireframeStack
                    )
                }
            };

        case actions.CHANGE_OBJECT_OPACITY:
            const objectForOpacity = state.objects[action.payload.objectId];
            return {
                ...state,
                objects: {
                    ...state.objects,
                    [action.payload.objectId]: new ViewerObject(
                        objectForOpacity.id,
                        objectForOpacity.type,
                        objectForOpacity.color,
                        action.payload.opacity,
                        objectForOpacity.visibility,
                        objectForOpacity.stack,
                        objectForOpacity.wireframeStack
                    )
                }
            };

        case actions.CHANGE_ALL_OBJECTS_OPACITY:
            const updatedObjects = Object.keys(state.objects).reduce((acc, objectId) => {
                const obj = state.objects[objectId];
                acc[objectId] = new ViewerObject(
                    obj.id,
                    obj.type,
                    obj.color,
                    action.payload,
                    obj.visibility,
                    obj.stack,
                    obj.wireframeStack
                );
                return acc;
            }, {});
            return {
                ...state,
                objects: updatedObjects
            };

        case actions.CHANGE_OBJECT_COLOR:
            const objectToChangeColor = state.objects[action.payload.objectId];
            return {
                ...state,
                objects: {
                    ...state.objects,
                    [action.payload.objectId]: new ViewerObject(
                        objectToChangeColor.id,
                        objectToChangeColor.type,
                        action.payload.color,
                        objectToChangeColor.opacity,
                        objectToChangeColor.visibility,
                        objectToChangeColor.stack,
                        objectToChangeColor.wireframeStack
                    )
                }
            };
        case actions.CHANGE_OBJECTS_ORDER:
            return {
                ...state,
                objectsOrder: action.payload.order
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
        case actions.SET_MODEL:
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

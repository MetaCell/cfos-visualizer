import {INIT_STATE} from "./store";
import {actions} from "./constants";
import {ActivityMap} from "../model/models";


const viewerReducer = (state = INIT_STATE.viewer, action) => {
    switch (action.type) {
        case actions.ADD_ACTIVITY_MAP_TO_VIEWER:
            return {
                ...state,
                activityMaps: {
                    ...state.activityMaps,
                    [action.payload.id]: action.payload,
                },
                activityMapsOrder: [...state.activityMapsOrder, action.payload.id]
            };

        case actions.REMOVE_ACTIVITY_MAP_FROM_VIEWER:
            const nextActivityMaps = { ...state.activityMaps };
            delete nextActivityMaps[action.payload];

            const newOrder = state.activityMapsOrder.filter(id => id !== action.payload);
            return { ...state, activityMaps: nextActivityMaps, activityMapsOrder: newOrder};

        case actions.TOGGLE_ACTIVITY_MAP_VISIBILITY:
            const activityMapForVisibility = state.activityMaps[action.payload];
            return {
                ...state,
                activityMaps: {
                    ...state.activityMaps,
                    [action.payload]: new ActivityMap(
                        activityMapForVisibility.id,
                        activityMapForVisibility.color,
                        activityMapForVisibility.opacity,
                        !activityMapForVisibility.visibility,
                        activityMapForVisibility.stack,
                    )
                }
            };

        case actions.CHANGE_ACTIVITY_MAP_OPACITY:
            const activityMapForOpacity = state.activityMaps[action.payload.activityMapID];
            return {
                ...state,
                activityMaps: {
                    ...state.activityMaps,
                    [action.payload.activityMapID]: new ActivityMap(
                        activityMapForOpacity.id,
                        activityMapForOpacity.color,
                        action.payload.opacity,
                        activityMapForOpacity.visibility,
                        activityMapForOpacity.stack,
                    )
                }
            };

        case actions.CHANGE_ALL_ACTIVITY_MAPS_OPACITY:
            const updatedActivityMaps = Object.keys(state.activityMaps).reduce((acc, activityMapID) => {
                const activityMap = state.activityMaps[activityMapID];
                acc[activityMapID] = new ActivityMap(
                    activityMap.id,
                    activityMap.color,
                    action.payload,
                    activityMap.visibility,
                    activityMap.stack,
                );
                return acc;
            }, {});
            return {
                ...state,
                activityMaps: updatedActivityMaps
            };

        case actions.CHANGE_ACTIVITY_MAP_COLOR:
            const activityMapForColor = state.activityMaps[action.payload.activityMapID];
            return {
                ...state,
                activityMaps: {
                    ...state.activityMaps,
                    [action.payload.activityMapID]: new ActivityMap(
                        activityMapForColor.id,
                        action.payload.color,
                        activityMapForColor.opacity,
                        activityMapForColor.visibility,
                        activityMapForColor.stack,
                    )
                }
            };
        case actions.CHANGE_ACTIVITY_MAPS_ORDER:
            return {
                ...state,
                activityMapsOrder: action.payload.order
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

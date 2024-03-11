import {INIT_STATE} from "./store";
import {actions} from "./constants";
import {ActivityMap, Atlas} from "../model/models";
import {DEFAULT_LOADING_MESSAGE} from "../settings";


const viewerReducer = (state = INIT_STATE.viewer, action) => {
    switch (action.type) {
        case actions.SET_VIEWER_ATLAS:
            return {
                ...state,
                atlas: action.payload,
                activityMaps: {},
                order: [action.payload.id]
            };

        case actions.ADD_ACTIVITY_MAP_TO_VIEWER:
            return {
                ...state,
                activityMaps: {
                    ...state.activityMaps,
                    [action.payload.id]: action.payload,
                },
                order: [...state.order, action.payload.id]
            };

        case actions.REMOVE_ACTIVITY_MAP_FROM_VIEWER:
            const nextActivityMaps = { ...state.activityMaps };
            delete nextActivityMaps[action.payload];

            const newOrder = state.order.filter(id => id !== action.payload);
            return { ...state, activityMaps: nextActivityMaps, order: newOrder};

        case actions.TOGGLE_VIEWER_OBJECT_VISIBILITY:
            if (state.activityMaps[action.payload]) {
                const activityMap = state.activityMaps[action.payload];
                return {
                    ...state,
                    activityMaps: {
                        ...state.activityMaps,
                        [action.payload]: new ActivityMap(
                            activityMap.id,
                            activityMap.colorRange,
                            activityMap.intensityRange,
                            !activityMap.visibility,
                            activityMap.stack,
                        )
                    }
                };
            }
            else if (state.atlas && state.atlas.id === action.payload) {
                const atlas = state.atlas;
                return {
                    ...state,
                    atlas: new Atlas(
                        atlas.id,
                        !atlas.visibility,
                        atlas.stack,
                        atlas.wireframeStack
                    )
                };
            }
            else {
                return state;
            }

        case actions.CHANGE_ACTIVITY_MAP_INTENSITY_RANGE:
            if (state.activityMaps[action.payload.id]) {
                const activityMap = state.activityMaps[action.payload.id];
                return {
                    ...state,
                    activityMaps: {
                        ...state.activityMaps,
                        [action.payload.id]: new ActivityMap(
                            activityMap.id,
                            activityMap.colorRange,
                            action.payload.intensityRange,
                            activityMap.visibility,
                            activityMap.stack,
                        )
                    }
                };
            }
            else {
                return state;
            }

        // case actions.CHANGE_ALL_VIEWER_OBJECTS_OPACITY:
        //     const updatedActivityMaps = Object.keys(state.activityMaps).reduce((acc, activityMapID) => {
        //         const activityMap = state.activityMaps[activityMapID];
        //         acc[activityMapID] = new ActivityMap(
        //             activityMap.id,
        //             activityMap.colorRange,
        //             getOpacityGradient(action.payload),
        //             activityMap.visibility,
        //             activityMap.stack,
        //         );
        //         return acc;
        //     }, {});
        //     const atlas = state.atlas;
        //     return {
        //         ...state,
        //         activityMaps: updatedActivityMaps,
        //         atlas: new Atlas(
        //             atlas.id,
        //             action.payload / 100,
        //             atlas.visibility,
        //             atlas.stack,
        //             atlas.wireframeStack
        //         )
        //     };

        case actions.CHANGE_ACTIVITY_MAP_COLOR_RANGE:
            const activityMap = state.activityMaps[action.payload.activityMapID];
            return {
                ...state,
                activityMaps: {
                    ...state.activityMaps,
                    [action.payload.activityMapID]: new ActivityMap(
                        activityMap.id,
                        action.payload.colorRange,
                        activityMap.intensityRange,
                        activityMap.visibility,
                        activityMap.stack,
                    )
                }
            };
        case actions.CHANGE_VIEWER_ORDER:
            return {
                ...state,
                order: action.payload.order
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
        case actions.START_LOADING:
            return {
                ...state,
                isLoading: true,
                loadingMessage: action.payload,
            };

        case actions.STOP_LOADING:
            return {
                ...state,
                isLoading: false,
                loadingMessage: DEFAULT_LOADING_MESSAGE,
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




// Viewer Actions

import {actions} from "./constants";


export const setViewerAtlas = (atlas) => ({
    type: actions.SET_VIEWER_ATLAS,
    payload: atlas
});

export const fetchAndAddActivityMapToViewer = (activityMapID) => ({
    type: actions.FETCH_AND_ADD_ACTIVITY_MAP_TO_VIEWER,
    payload: activityMapID
});
export const addActivityMapToViewer = (activityMap) => ({
    type: actions.ADD_ACTIVITY_MAP_TO_VIEWER,
    payload: activityMap
});

export const removeActivityMapFromViewer = (activityMapID) => ({
    type: actions.REMOVE_ACTIVITY_MAP_FROM_VIEWER,
    payload: activityMapID
});

export const toggleViewerObjectVisibility = (id) => ({
    type: actions.TOGGLE_VIEWER_OBJECT_VISIBILITY,
    payload: id
});

export const changeViewerObjectOpacity = (id, opacityInPercentage) => ({
    type: actions.CHANGE_VIEWER_OBJECT_OPACITY,
    payload: { id, opacity: opacityInPercentage }
});

export const changeAllViewerObjectsOpacity = (opacity) => ({
    type: actions.CHANGE_ALL_VIEWER_OBJECTS_OPACITY,
    payload: opacity
});

export const changeActivityMapColor = (activityMapID, colorGradient) => ({
    type: actions.CHANGE_ACTIVITY_MAP_COLOR_GRADIENT,
    payload: { activityMapID, colorGradient }
});

export const changeViewerOrder = (order) => ({
    type: actions.CHANGE_VIEWER_ORDER,
    payload: { order }
});

export const downloadViewerObject = (id) => ({
    type: actions.DOWNLOAD_VIEWER_OBJECT,
    payload: id
})

export const downloadAllObjects = () => ({
    type: actions.DOWNLOAD_ALL_OBJECTS
})

// Experiment Actions
export const fetchAndSetExperimentAndAtlas = (experimentID, atlasID) => ({
    type: actions.FETCH_AND_SET_CURRENT_EXPERIMENT_AND_ATLAS,
    payload: { experimentID, atlasID }
});

export const setCurrentExperiment = (experiment) => ({
    type: actions.SET_CURRENT_EXPERIMENT,
    payload: experiment
});

// Model Actions

export const fetchModel = () => ({
    type: actions.FETCH_MODEL
});

export const setModel = data => ({
    type: actions.SET_MODEL,
    payload: data
});


// UI Actions
export const startLoading = (message) => ({
    type: actions.START_LOADING,
    payload: message
});

export const stopLoading = (message) => ({
    type: actions.STOP_LOADING,
    payload: message
});

export const setError = (error) => ({
    type: actions.SET_ERROR,
    payload: error
});

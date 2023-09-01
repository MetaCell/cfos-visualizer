


// Viewer Actions

import {actions} from "./constants";

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

export const toggleActivityMapVisibility = (activityMapID) => ({
    type: actions.TOGGLE_ACTIVITY_MAP_VISIBILITY,
    payload: activityMapID
});

export const changeActivityMapOpacity = (activityMapID, opacity) => ({
    type: actions.CHANGE_ACTIVITY_MAP_OPACITY,
    payload: { activityMapID, opacity }
});

export const changeAllActivityMapsOpacity = (opacity) => ({
    type: actions.CHANGE_ALL_ACTIVITY_MAPS_OPACITY,
    payload: opacity
});

export const changeActivityMapColor = (activityMapID, color) => ({
    type: actions.CHANGE_ACTIVITY_MAP_COLOR,
    payload: { activityMapID, color }
});

export const changeActivityMapsOrder = (order) => ({
    type: actions.CHANGE_ACTIVITY_MAPS_ORDER,
    payload: { order }
});

export const triggerActivityMapDownload = (activityMapID) => ({
    type: actions.DOWNLOAD_ACTIVITY_MAP,
    payload: activityMapID
})

export const triggerDownloadAllObjects = () => ({
    type: actions.DOWNLOAD_ALL_OBJECTS
})

// Experiment Actions
export const fetchExperiment = (experimentId) => ({
    type: actions.FETCH_CURRENT_EXPERIMENT,
    payload: experimentId
});

export const setCurrentExperiment = (experiment) => ({
    type: actions.SET_CURRENT_EXPERIMENT,
    payload: experiment
});


export const fetchModel = () => ({
    type: actions.FETCH_MODEL
});

export const setModel = data => ({
    type: actions.SET_MODEL,
    payload: data
});


// UI Actions
export const setLoading = (isLoading) => ({
    type: actions.SET_LOADING,
    payload: isLoading
});

export const setError = (error) => ({
    type: actions.SET_ERROR,
    payload: error
});

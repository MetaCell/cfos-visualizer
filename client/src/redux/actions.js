


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

export const changeViewerObjectOpacity = (id, opacity) => ({
    type: actions.CHANGE_VIEWER_OBJECT_OPACITY,
    payload: { id, opacity }
});

export const changeAllViewerObjectsOpacity = (opacity) => ({
    type: actions.CHANGE_ALL_VIEWER_OBJECTS_OPACITY,
    payload: opacity
});

export const changeActivityMapLUT = (activityMapID, lutID) => ({
    type: actions.CHANGE_ACTIVITY_MAP_LUT,
    payload: { activityMapID, lutID }
});

export const changeViewerOrder = (order) => ({
    type: actions.CHANGE_VIEWER_ORDER,
    payload: { order }
});

export const triggerViewerObjectDownload = (id) => ({
    type: actions.DOWNLOAD_VIEWER_OBJECT,
    payload: id
})

export const triggerDownloadAllObjects = () => ({
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
export const setLoading = (isLoading) => ({
    type: actions.SET_LOADING,
    payload: isLoading
});

export const setError = (error) => ({
    type: actions.SET_ERROR,
    payload: error
});
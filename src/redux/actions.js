


// Viewer Actions

import {actions} from "./constants";

export const addObjectToViewer = (objectID, type) => ({
    type: actions.ADD_OBJECT_TO_VIEWER,
    payload: { objectID, type }
});
export const setObjectToViewer = (object) => ({
    type: actions.SET_OBJECT_TO_VIEWER,
    payload: object
});

export const removeObjectFromViewer = (objectId) => ({
    type: actions.REMOVE_OBJECT_FROM_VIEWER,
    payload: objectId
});

export const toggleObjectVisibility = (objectId) => ({
    type: actions.TOGGLE_OBJECT_VISIBILITY,
    payload: objectId
});

export const changeObjectOpacity = (objectId, opacity) => ({
    type: actions.CHANGE_OBJECT_OPACITY,
    payload: { objectId, opacity }
});

export const changeAllObjectsOpacity = (opacity) => ({
    type: actions.CHANGE_ALL_OBJECTS_OPACITY,
    payload: opacity
});

export const changeObjectColor = (objectId, color) => ({
    type: actions.CHANGE_OBJECT_COLOR,
    payload: { objectId, color }
});

export const changeObjectsOrder = (order) => ({
    type: actions.CHANGE_OBJECTS_ORDER,
    payload: { order }
});

export const downloadObject = (objectId) => ({
    type: actions.DOWNLOAD_OBJECT,
    payload: objectId
})

export const downloadAllObjects = () => ({
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

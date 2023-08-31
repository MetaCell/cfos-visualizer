


// Viewer Actions

import {actions} from "./constants";

export const addObjectToViewer = (object) => ({
    type: actions.ADD_OBJECT_TO_VIEWER,
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

// Experiment Actions
export const setCurrentExperiment = (experimentId) => ({
    type: actions.SET_CURRENT_EXPERIMENT,
    payload: experimentId
});

export const fetchModelData = () => ({
    type: actions.FETCH_MODEL_DATA
});

export const setModelDataSuccess = data => ({
    type: actions.FETCH_MODEL_DATA_SUCCESS,
    payload: data
});

export const setModelDataFailure = error => ({
    type: actions.FETCH_MODEL_DATA_FAILURE,
    payload: error
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


import {
    ADD_OBJECT_TO_VIEWER, CHANGE_ALL_OBJECTS_OPACITY,
    CHANGE_OBJECT_OPACITY, FETCH_MODEL_DATA,
    REMOVE_OBJECT_FROM_VIEWER, SET_CURRENT_EXPERIMENT, SET_ERROR, SET_LOADING, SET_VIEWER_MODE,
    TOGGLE_OBJECT_VISIBILITY
} from "./constants";

// Viewer Actions

export const addObjectToViewer = (object) => ({
    type: ADD_OBJECT_TO_VIEWER,
    payload: object
});

export const removeObjectFromViewer = (objectId) => ({
    type: REMOVE_OBJECT_FROM_VIEWER,
    payload: objectId
});

export const toggleObjectVisibility = (objectId) => ({
    type: TOGGLE_OBJECT_VISIBILITY,
    payload: objectId
});

export const changeObjectOpacity = (objectId, opacity) => ({
    type: CHANGE_OBJECT_OPACITY,
    payload: { objectId, opacity }
});

export const changeAllObjectsOpacity = (opacity) => ({
    type: CHANGE_ALL_OBJECTS_OPACITY,
    payload: opacity
});

export const setViewerMode = (mode) => ({
    type: SET_VIEWER_MODE,
    payload: mode
});

// Experiment Actions
export const setCurrentExperiment = (experiment) => ({
    type: SET_CURRENT_EXPERIMENT,
    payload: experiment
});

export const fetchModelData = () => ({
    type: FETCH_MODEL_DATA
});

// UI Actions
export const setLoading = (isLoading) => ({
    type: SET_LOADING,
    payload: isLoading
});

export const setError = (error) => ({
    type: SET_ERROR,
    payload: error
});

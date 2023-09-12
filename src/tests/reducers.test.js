
import {Experiment, ActivityMap, Atlas} from "../model/models";
import {currentExperimentReducer, modelReducer, uiReducer, viewerReducer} from "../redux/reducers";
import {
    addActivityMapToViewer,
    changeAllViewerObjectsOpacity,
    changeViewerObjectOpacity,
    removeActivityMapFromViewer, setError, setLoading, setModel,
    toggleViewerObjectVisibility, setCurrentExperiment, changeActivityMapLUT, changeViewerOrder, setViewerAtlas
} from "../redux/actions";
import {INIT_STATE} from "../redux/store";


describe('viewerReducer', () => {

    const activityMapID = "ActivityMap1"
    const atlasID = "Atlas1"
    const atlas = new Atlas(atlasID, 1, true, 'stack', 'wireframeStack');
    const initialState = {
        atlas: atlas,
        activityMaps: {},
        order: [atlas.id]
    };

    it('should handle SET_VIEWER_ATLAS', () => {
        const expectedState = {
            atlas: atlas,
            activityMaps: {},
            order: [atlas.id]
        };

        expect(viewerReducer({...INIT_STATE.viewer}, setViewerAtlas(atlas))).toEqual(expectedState);
    });

    it('should handle ADD_ACTIVITY_MAP_TO_VIEWER', () => {
        const newActivityMap = new ActivityMap(activityMapID, 'red', 1, true, 'stack');
        const expectedState = {
            ...initialState,
            activityMaps: {
                [activityMapID]: newActivityMap
            },
            order: [atlas.id, activityMapID]
        };

        expect(viewerReducer(initialState, addActivityMapToViewer(newActivityMap))).toEqual(expectedState);
    });



    it('should handle REMOVE_ACTIVITY_MAP_FROM_VIEWER', () => {
        const objectToRemove = new ActivityMap(activityMapID, 'red', 1, true, 'stack', 'wireframeStack');
        const setupState = {
            activityMaps: {
                [activityMapID]: objectToRemove,
            },
            order: [activityMapID]
        };


        const expectedState = {
            activityMaps: {},
            order: []
        };

        expect(viewerReducer(setupState, removeActivityMapFromViewer(activityMapID))).toEqual(expectedState);
    });

    it('should handle TOGGLE_VIEWER_OBJECT_VISIBILITY for activityMap', () => {
        const activityMap = new ActivityMap(activityMapID, 'red', 1, true, 'stack');
        const setupState = {
            ...initialState,
            activityMaps: {
                [activityMapID]: activityMap
            }
        };

        const expectedState = {
            ...setupState,
            activityMaps: {
                [activityMapID]: new ActivityMap(activityMapID, 'red', 1, false, 'stack')
            }
        };

        expect(viewerReducer(setupState, toggleViewerObjectVisibility(activityMapID))).toEqual(expectedState);
    });

    it('should handle TOGGLE_VIEWER_OBJECT_VISIBILITY for atlas', () => {

        const expectedState = {
            ...initialState,
            atlas: new Atlas(atlasID, 1, false, 'stack', 'wireframeStack')
        };

        expect(viewerReducer(initialState, toggleViewerObjectVisibility(atlasID))).toEqual(expectedState);
    });


    it('should handle CHANGE_VIEWER_OBJECT_OPACITY for activityMap', () => {
        const activityMap = new ActivityMap(activityMapID, 'red', 1, true, 'stack');
        const setupState = {
            ...initialState,
            activityMaps: {
                [activityMapID]: activityMap
            }
        };

        const expectedState = {
            ...setupState,
            activityMaps: {
                [activityMapID]: new ActivityMap(activityMapID, 'red', 0.5, true, 'stack')
            }
        };

        expect(viewerReducer(setupState, changeViewerObjectOpacity(activityMapID, 0.5))).toEqual(expectedState);
    });

    it('should handle CHANGE_VIEWER_OBJECT_OPACITY for atlas', () => {

        const expectedState = {
            ...initialState,
            atlas: new Atlas(atlasID, 0.5, true, 'stack', 'wireframeStack')
        };

        expect(viewerReducer(initialState, changeViewerObjectOpacity(atlasID, 0.5))).toEqual(expectedState);
    });

    it('should handle CHANGE_ALL_VIEWER_OBJECTS_OPACITY', () => {
        const newOpacity = 0.7
        const object1 = new ActivityMap(activityMapID,  'red', 1, true, 'stack');
        const setupState = {
            ...initialState,
            activityMaps: {
                [activityMapID]: object1,
            }
        };

        const expectedState = {
            ...initialState,
            atlas: new Atlas(atlasID, newOpacity, true, 'stack', 'wireframeStack'),
            activityMaps: {
                [activityMapID]: { ...object1, opacity: newOpacity },
            }
        };

        expect(viewerReducer(setupState, changeAllViewerObjectsOpacity(newOpacity))).toEqual(expectedState);
    });
//
    it('should handle CHANGE_ACTIVITY_MAP_COLOR', () => {
        const initialObject = new ActivityMap(activityMapID, 'red', 1, true, 'stack');
        const setupState = {
            activityMaps: {
                [activityMapID]: initialObject
            }
        };

        const expectedState = {
            activityMaps: {
               [activityMapID]: new ActivityMap(activityMapID, 'blue', 1, true, 'stack')
            }
        };

        const changeColorAction = changeActivityMapLUT(activityMapID, 'blue');

        expect(viewerReducer(setupState, changeColorAction)).toEqual(expectedState);
    });

    it('should handle CHANGE_VIEWER_ORDER', () => {
        const setupState = {
            order: ['1', '2', '3']
        };

        const newOrder = ['3', '1', '2'];
        const expectedState = {
            order: newOrder
        };

        const changeOrderAction = changeViewerOrder(newOrder)

        expect(viewerReducer(setupState, changeOrderAction)).toEqual(expectedState);
    });
});

describe('currentExperimentReducer', () => {

    // Initial state for the tests
    const initialState = null;

    it('should handle SET_CURRENT_EXPERIMENT', () => {
        const mockData = require('./resources/experiment.json');

        const newExperiment = new Experiment('1', mockData);

        expect(currentExperimentReducer(initialState, setCurrentExperiment(newExperiment))).toEqual(newExperiment);
    });

    it('should return initial state if action type does not match', () => {
        const action = {
            type: 'UNKNOWN_ACTION_TYPE',
            payload: {}
        };

        expect(currentExperimentReducer(initialState, action)).toEqual(initialState);
    });

});



describe('modelReducer', () => {

    // Initial state for the tests
    const initialState = {
        experimentsAtlas: {},
        atlasActivityMap: {},
        experimentsActivityMap: {},
        luts: {}
    };

    it('should handle FETCH_MODEL_DATA_SUCCESS', async () => {
        // Mock data fetched from file
        const mockData = require('./resources/index.json');

        expect(modelReducer(initialState, setModel(mockData))).toEqual({
            ...initialState,
            ...mockData
        });
    });

    it('should return initial state if action type does not match', () => {
        const action = {
            type: 'UNKNOWN_ACTION_TYPE',
            payload: {}
        };

        expect(modelReducer(initialState, action)).toEqual(initialState);
    });

});

describe('uiReducer', () => {

    const initialState = {
        isLoading: false,
        errors: null
    };

    it('should handle SET_LOADING', () => {
        const action = setLoading(true);

        expect(uiReducer(initialState, action)).toEqual({
            ...initialState,
            isLoading: true
        });
    });

    it('should handle SET_ERROR', () => {
        const action = setError('Error occurred');

        expect(uiReducer(initialState, action)).toEqual({
            ...initialState,
            errors: 'Error occurred'
        });
    });

    it('should return initial state if action type does not match', () => {
        const action = {
            type: 'UNKNOWN_ACTION_TYPE',
            payload: {}
        };

        expect(uiReducer(initialState, action)).toEqual(initialState);
    });

});

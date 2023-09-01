
import {Experiment, ActivityMap} from "../model/models";
import {currentExperimentReducer, modelReducer, uiReducer, viewerReducer} from "../redux/reducers";
import {
    addActivityMapToViewer,
    changeAllActivityMapsOpacity,
    changeActivityMapOpacity,
    removeActivityMapFromViewer, setError, setLoading, setModel,
    toggleActivityMapVisibility, setCurrentExperiment, changeActivityMapColor, changeActivityMapsOrder
} from "../redux/actions";


describe('viewerReducer', () => {

    // Initial state for the tests
    const initialState = {
        activityMapsOrder: [],
        activityMaps: {}
    };

    it('should handle ADD_ACTIVITY_MAP_TO_VIEWER', () => {
        const newObject = new ActivityMap('1', 'Atlas', 'red', 1, true, 'stack', 'wireframeStack');

        const expectedState = {
            activityMaps: {
                '1': newObject
            },
            activityMapsOrder: ['1']
        };

        expect(viewerReducer(initialState, addActivityMapToViewer(newObject))).toEqual(expectedState);
    });

    it('should handle REMOVE_ACTIVITY_MAP_FROM_VIEWER', () => {
        const objectToRemove = new ActivityMap('1', 'Atlas', 'red', 1, true, 'stack', 'wireframeStack');
        const setupState = {
            activityMaps: {
                '1': objectToRemove,
            },
            activityMapsOrder: ['1']
        };


        const expectedState = {
            activityMaps: {},
            activityMapsOrder: []
        };

        expect(viewerReducer(setupState, removeActivityMapFromViewer('1'))).toEqual(expectedState);
    });

    it('should handle TOGGLE_ACTIVITY_MAP_VISIBILITY', () => {
        const objectToToggle = new ActivityMap('1', 'Atlas', 'red', 1, true, 'stack', 'wireframeStack');
        const setupState = {
            activityMaps: {
                '1': objectToToggle
            }
        };

        const expectedState = {
            activityMaps: {
                '1': {
                    ...objectToToggle,
                    visibility: false
                }
            }
        };

        expect(viewerReducer(setupState, toggleActivityMapVisibility('1'))).toEqual(expectedState);
    });

    it('should handle CHANGE_ACTIVITY_MAP_OPACITY', () => {
        const objectToUpdate = new ActivityMap('1', 'Atlas', 'red', 1, true, 'stack', 'wireframeStack');
        const setupState = {
            activityMaps: {
                '1': objectToUpdate
            }
        };

        const expectedState = {
            activityMaps: {
                '1': {
                    ...objectToUpdate,
                    opacity: 0.5
                }
            }
        };

        expect(viewerReducer(setupState, changeActivityMapOpacity('1', 0.5))).toEqual(expectedState);
    });

    it('should handle CHANGE_ALL_ACTIVITY_MAPS_OPACITY', () => {
        const object1 = new ActivityMap('1', 'Atlas', 'red', 1, true, 'stack', 'wireframeStack');
        const object2 = new ActivityMap('2', 'Atlas', 'blue', 0.8, true, 'stack', 'wireframeStack');
        const setupState = {
            activityMaps: {
                '1': object1,
                '2': object2
            }
        };

        const expectedState = {
            activityMaps: {
                '1': { ...object1, opacity: 0.7 },
                '2': { ...object2, opacity: 0.7 }
            }
        };

        expect(viewerReducer(setupState, changeAllActivityMapsOpacity(0.7))).toEqual(expectedState);
    });
//
    it('should handle CHANGE_ACTIVITY_MAP_COLOR', () => {
        const initialObject = new ActivityMap('1', 'red', 1, true, 'stack');
        const setupState = {
            activityMaps: {
                '1': initialObject
            }
        };

        const expectedState = {
            activityMaps: {
                '1': new ActivityMap('1', 'blue', 1, true, 'stack')
            }
        };

        const changeColorAction = changeActivityMapColor('1', 'blue');

        expect(viewerReducer(setupState, changeColorAction)).toEqual(expectedState);
    });

    it('should handle CHANGE_ACTIVITY_MAPS_ORDER', () => {
        const setupState = {
            activityMaps: {},
            activityMapsOrder: ['1', '2', '3']
        };

        const newOrder = ['3', '1', '2'];
        const expectedState = {
            activityMaps: {},
            activityMapsOrder: newOrder
        };

        const changeOrderAction = changeActivityMapsOrder(newOrder)

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

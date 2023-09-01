
import {Experiment, ViewerObject} from "../model/models";
import {currentExperimentReducer, modelReducer, uiReducer, viewerReducer} from "../redux/reducers";
import {
    setObjectToViewer,
    changeAllObjectsOpacity,
    changeObjectOpacity,
    removeObjectFromViewer, setError, setLoading, setModel,
    toggleObjectVisibility, setCurrentExperiment, changeObjectColor, changeObjectsOrder
} from "../redux/actions";


describe('viewerReducer', () => {

    // Initial state for the tests
    const initialState = {
        objects: {}
    };

    it('should handle ADD_OBJECT_TO_VIEWER', () => {
        const newObject = new ViewerObject('1', 'Atlas', 'red', 1, true, 'stack', 'wireframeStack');

        const expectedState = {
            objects: {
                '1': newObject
            }
        };

        expect(viewerReducer(initialState, setObjectToViewer(newObject))).toEqual(expectedState);
    });

    it('should handle REMOVE_OBJECT_FROM_VIEWER', () => {
        const objectToRemove = new ViewerObject('1', 'Atlas', 'red', 1, true, 'stack', 'wireframeStack');
        const setupState = {
            objects: {
                '1': objectToRemove
            }
        };


        const expectedState = {
            objects: {}
        };

        expect(viewerReducer(setupState, removeObjectFromViewer('1'))).toEqual(expectedState);
    });

    // ... You can continue to add more tests for other action types

    it('should handle TOGGLE_OBJECT_VISIBILITY', () => {
        const objectToToggle = new ViewerObject('1', 'Atlas', 'red', 1, true, 'stack', 'wireframeStack');
        const setupState = {
            objects: {
                '1': objectToToggle
            }
        };

        const expectedState = {
            objects: {
                '1': {
                    ...objectToToggle,
                    visibility: false
                }
            }
        };

        expect(viewerReducer(setupState, toggleObjectVisibility('1'))).toEqual(expectedState);
    });

    it('should handle CHANGE_OBJECT_OPACITY', () => {
        const objectToUpdate = new ViewerObject('1', 'Atlas', 'red', 1, true, 'stack', 'wireframeStack');
        const setupState = {
            objects: {
                '1': objectToUpdate
            }
        };

        const expectedState = {
            objects: {
                '1': {
                    ...objectToUpdate,
                    opacity: 0.5
                }
            }
        };

        expect(viewerReducer(setupState, changeObjectOpacity('1', 0.5))).toEqual(expectedState);
    });

    it('should handle CHANGE_ALL_OBJECTS_OPACITY', () => {
        const object1 = new ViewerObject('1', 'Atlas', 'red', 1, true, 'stack', 'wireframeStack');
        const object2 = new ViewerObject('2', 'Atlas', 'blue', 0.8, true, 'stack', 'wireframeStack');
        const setupState = {
            objects: {
                '1': object1,
                '2': object2
            }
        };

        const expectedState = {
            objects: {
                '1': { ...object1, opacity: 0.7 },
                '2': { ...object2, opacity: 0.7 }
            }
        };

        expect(viewerReducer(setupState, changeAllObjectsOpacity(0.7))).toEqual(expectedState);
    });

    it('should handle CHANGE_OBJECT_COLOR', () => {
        const initialObject = new ViewerObject('1', 'Atlas', 'red', 1, true, 'stack', 'wireframeStack');
        const setupState = {
            objects: {
                '1': initialObject
            }
        };

        const expectedState = {
            objects: {
                '1': new ViewerObject('1', 'Atlas', 'blue', 1, true, 'stack', 'wireframeStack')
            }
        };

        const changeColorAction = changeObjectColor('1', 'blue');

        expect(viewerReducer(setupState, changeColorAction)).toEqual(expectedState);
    });


    it('should handle CHANGE_OBJECTS_ORDER', () => {
        const setupState = {
            objects: {},
            objectsOrder: ['1', '2', '3']
        };

        const newOrder = ['3', '1', '2'];
        const expectedState = {
            objects: {},
            objectsOrder: newOrder
        };

        const changeOrderAction = changeObjectsOrder(newOrder)

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


import {Experiment, ViewerObject} from "../model/models";
import {currentExperimentReducer, modelReducer, viewerReducer} from "../redux/reducers";
import {
    addObjectToViewer,
    changeAllObjectsOpacity,
    changeObjectOpacity,
    removeObjectFromViewer, setModelDataSuccess,
    toggleObjectVisibility
} from "../redux/actions";


describe('viewerReducer', () => {

    // Initial state for the tests
    const initialState = {
        objects: {}
    };

    it('should handle ADD_OBJECT_TO_VIEWER', () => {
        const newObject = new ViewerObject('1', 'Atlas', 'red', 1, true);

        const expectedState = {
            objects: {
                '1': newObject
            }
        };

        expect(viewerReducer(initialState, addObjectToViewer(newObject))).toEqual(expectedState);
    });

    it('should handle REMOVE_OBJECT_FROM_VIEWER', () => {
        const objectToRemove = new ViewerObject('1', 'Atlas', 'red', 1, true);
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
        const objectToToggle = new ViewerObject('1', 'Atlas', 'red', 1, true);
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
        const objectToUpdate = new ViewerObject('1', 'Atlas', 'red', 1, true);
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
        const object1 = new ViewerObject('1', 'Atlas', 'red', 1, true);
        const object2 = new ViewerObject('2', 'Atlas', 'blue', 0.8, true);
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

        expect(modelReducer(initialState, setModelDataSuccess(mockData))).toEqual({
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

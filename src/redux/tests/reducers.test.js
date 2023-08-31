import {currentExperimentReducer, viewerReducer} from '../reducers';
import {
    ADD_OBJECT_TO_VIEWER, CHANGE_ALL_OBJECTS_OPACITY, CHANGE_OBJECT_OPACITY,
    REMOVE_OBJECT_FROM_VIEWER, SET_CURRENT_EXPERIMENT,
    TOGGLE_OBJECT_VISIBILITY
} from '../constants';
import {Experiment, ViewerObject} from '../../model/models';

describe('viewerReducer', () => {

    // Initial state for the tests
    const initialState = {
        objects: {}
    };

    it('should handle ADD_OBJECT_TO_VIEWER', () => {
        const newObject = new ViewerObject('1', 'Atlas', 'red', 1, true);
        const action = {
            type: ADD_OBJECT_TO_VIEWER,
            payload: newObject
        };

        const expectedState = {
            objects: {
                '1': newObject
            }
        };

        expect(viewerReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle REMOVE_OBJECT_FROM_VIEWER', () => {
        const objectToRemove = new ViewerObject('1', 'Atlas', 'red', 1, true);
        const setupState = {
            objects: {
                '1': objectToRemove
            }
        };

        const action = {
            type: REMOVE_OBJECT_FROM_VIEWER,
            payload: '1'
        };

        const expectedState = {
            objects: {}
        };

        expect(viewerReducer(setupState, action)).toEqual(expectedState);
    });

    // ... You can continue to add more tests for other action types

    it('should handle TOGGLE_OBJECT_VISIBILITY', () => {
        const objectToToggle = new ViewerObject('1', 'Atlas', 'red', 1, true);
        const setupState = {
            objects: {
                '1': objectToToggle
            }
        };

        const action = {
            type: TOGGLE_OBJECT_VISIBILITY,
            payload: '1'
        };

        const expectedState = {
            objects: {
                '1': {
                    ...objectToToggle,
                    visibility: false
                }
            }
        };

        expect(viewerReducer(setupState, action)).toEqual(expectedState);
    });

    it('should handle CHANGE_OBJECT_OPACITY', () => {
        const objectToUpdate = new ViewerObject('1', 'Atlas', 'red', 1, true);
        const setupState = {
            objects: {
                '1': objectToUpdate
            }
        };

        const action = {
            type: CHANGE_OBJECT_OPACITY,
            payload: { objectId: '1', opacity: 0.5 }
        };

        const expectedState = {
            objects: {
                '1': {
                    ...objectToUpdate,
                    opacity: 0.5
                }
            }
        };

        expect(viewerReducer(setupState, action)).toEqual(expectedState);
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

        const action = {
            type: CHANGE_ALL_OBJECTS_OPACITY,
            payload: 0.7
        };

        const expectedState = {
            objects: {
                '1': { ...object1, opacity: 0.7 },
                '2': { ...object2, opacity: 0.7 }
            }
        };

        expect(viewerReducer(setupState, action)).toEqual(expectedState);
    });

});

describe('currentExperimentReducer', () => {

    // Initial state for the tests
    const initialState = null;

    it('should handle SET_CURRENT_EXPERIMENT', () => {
        const newExperimentDetails = {
            description: 'Sample description',
            date: '2023-08-30',
            // ... other details
        };
        const newExperiment = new Experiment('1', newExperimentDetails);
        const action = {
            type: SET_CURRENT_EXPERIMENT,
            payload: newExperiment
        };

        expect(currentExperimentReducer(initialState, action)).toEqual(newExperiment);
    });

    it('should return initial state if action type does not match', () => {
        const action = {
            type: 'UNKNOWN_ACTION_TYPE',
            payload: {}
        };

        expect(currentExperimentReducer(initialState, action)).toEqual(initialState);
    });

});
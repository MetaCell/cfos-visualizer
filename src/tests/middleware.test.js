import {middleware} from '../redux/middleware';
import {
    fetchModelStructure,
    fetchExperimentMetadata,
    fetchAtlasStack,
    fetchAtlasWireframeStack, fetchActivityMapStack, fetchLUTFile
} from '../services/fetchService';
import {
    addObjectToViewer, downloadAllObjects, downloadObject,
    fetchExperiment,
    fetchModel,
    setCurrentExperiment,
    setError,
    setModel, setObjectToViewer
} from "../redux/actions";
import {Experiment, ViewerObject, ViewerObjectType} from "../model/models";
import {DEFAULT_COLOR, DEFAULT_OPACITY, DEFAULT_VISIBILITY} from "../settings";
import {downloadAllViewerObjects, downloadViewerObject} from "../services/downloadService";

// Mocking the fetchService functions
jest.mock('../services/fetchService', () => ({
    fetchModelStructure: jest.fn(),
    fetchLUTFile: jest.fn(),
    fetchExperimentMetadata: jest.fn(),
    fetchAtlasStack: jest.fn(),
    fetchAtlasWireframeStack: jest.fn(),
    fetchActivityMapStack: jest.fn(),
}));
jest.mock('../services/downloadService', () => ({
    downloadViewerObject: jest.fn(),
    downloadAllViewerObjects: jest.fn(),
}));

describe('Middleware', () => {
    let store, next;

    beforeEach(() => {
        store = {
            dispatch: jest.fn()
        };
        next = jest.fn();
    });

    it('should handle FETCH_MODEL', async () => {
        const mockData = require('./resources/index.json');
        fetchModelStructure.mockResolvedValueOnce(mockData);
        const mockLUTData = require('./resources/lut.json');

        mockData.luts.forEach(lutID => {
            fetchLUTFile.mockResolvedValueOnce(mockLUTData);
        });

        const action = fetchModel()

        await middleware(store)(next)(action);

        const expectedLutsMap = mockData.luts.reduce((acc, lutID) => {
            acc[lutID] = mockLUTData;
            return acc;
        }, {});

        expect(store.dispatch).toHaveBeenCalledWith(setModel({ ...mockData, luts: expectedLutsMap }));
    });

    it('should handle error during FETCH_MODEL', async () => {
        const errorMessage = 'Some Error';
        fetchModelStructure.mockRejectedValueOnce(new Error(errorMessage));

        const action = fetchModel()
        await middleware(store)(next)(action);

        expect(store.dispatch).toHaveBeenCalledWith(setError(errorMessage));
    });

    it('should handle FETCH_CURRENT_EXPERIMENT', async () => {
        const mockData = require('./resources/experiment.json');
        const experimentID = "someID";
        fetchExperimentMetadata.mockResolvedValueOnce(mockData);

        const action = fetchExperiment(experimentID)

        await middleware(store)(next)(action);

        expect(store.dispatch).toHaveBeenCalledWith(setCurrentExperiment(new Experiment(experimentID, mockData)));
    });

    it('should handle ADD_OBJECT_TO_VIEWER for ATLAS type', async () => {
        const atlasStack = require('./resources/atlas.json');
        const atlasWireframeStack = require('./resources/atlas_wireframe.json');

        fetchAtlasStack.mockResolvedValueOnce(atlasStack);
        fetchAtlasWireframeStack.mockResolvedValueOnce(atlasStack);

        const action = addObjectToViewer('atlasID', ViewerObjectType.ATLAS);

        await middleware(store)(next)(action);

        const expectedObject = new ViewerObject(
            'atlasID',
            ViewerObjectType.ATLAS,
            DEFAULT_COLOR,
            DEFAULT_OPACITY,
            DEFAULT_VISIBILITY,
            atlasStack,
            atlasWireframeStack
        );

        expect(store.dispatch).toHaveBeenCalledWith(setObjectToViewer(expectedObject));
    });

    it('should handle ADD_OBJECT_TO_VIEWER for ACTIVITY_MAP type', async () => {
        const activityMapStack = require('./resources/activity_map.json');

        fetchActivityMapStack.mockResolvedValueOnce(activityMapStack);

        const action = addObjectToViewer('activityMapID', ViewerObjectType.ACTIVITY_MAP);

        await middleware(store)(next)(action);

        const expectedObject = new ViewerObject(
            'activityMapID',
            ViewerObjectType.ACTIVITY_MAP,
            DEFAULT_COLOR,
            DEFAULT_OPACITY,
            DEFAULT_VISIBILITY,
            activityMapStack,
            null
        );

        expect(store.dispatch).toHaveBeenCalledWith(setObjectToViewer(expectedObject));
    });

    it('should handle error during ADD_OBJECT_TO_VIEWER', async () => {
        const errorMessage = 'Some Error';
        fetchAtlasStack.mockRejectedValueOnce(new Error(errorMessage));

        const action = addObjectToViewer('atlasID', ViewerObjectType.ATLAS);

        await middleware(store)(next)(action);

        expect(store.dispatch).toHaveBeenCalledWith(setError(errorMessage));
    });

    it('should handle DOWNLOAD_OBJECT', () => {
        const mockObjectID = '1';
        const mockObjectType = 'Atlas';
        const mockObject = new ViewerObject(mockObjectID, mockObjectType, 'red', 1, true, 'stack', 'wireframeStack');

        // Mock the state of the store
        store.getState = jest.fn().mockReturnValue({
            viewer: {
                objects: {
                    [mockObjectID]: mockObject
                }
            }
        });

        middleware(store)(next)(downloadObject(mockObjectID));

        expect(downloadViewerObject).toHaveBeenCalledWith(mockObject);
    });

    it('should handle DOWNLOAD_ALL_OBJECTS', () => {
        const mockObjects = {
            '1': new ViewerObject('1', 'Atlas', 'red', 1, true, 'stack1', 'wireframeStack1'),
            '2': new ViewerObject('2', 'Atlas', 'blue', 1, true, 'stack2', 'wireframeStack2'),
        };

        // Mock the state of the store
        store.getState = jest.fn().mockReturnValue({
            viewer: {
                objects: mockObjects
            }
        });

        middleware(store)(next)(downloadAllObjects());

        expect(downloadAllViewerObjects).toHaveBeenCalledWith(Object.values(mockObjects));
    });

});

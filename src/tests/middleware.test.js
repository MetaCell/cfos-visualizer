import {middleware} from '../redux/middleware';
import {
    fetchModelStructure,
    fetchExperimentMetadata,
    fetchAtlasStack,
    fetchAtlasWireframeStack, fetchActivityMapStack, fetchLUTFile
} from '../services/fetchService';
import {
    fetchAndAddActivityMapToViewer, triggerDownloadAllObjects, triggerActivityMapDownload,
    fetchExperiment,
    fetchModel,
    setCurrentExperiment,
    setError,
    setModel, addActivityMapToViewer
} from "../redux/actions";
import {Experiment, ActivityMap, ViewerObjectType} from "../model/models";
import {DEFAULT_COLOR, DEFAULT_OPACITY, DEFAULT_VISIBILITY} from "../settings";
import {downloadActivityMap, downloadAllViewerObjects, downloadAtlas} from "../services/downloadService";

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
    downloadActivityMap: jest.fn(),
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

    it('should handle ADD_ACTIVITY_MAP_TO_VIEWER', async () => {
        const activityMapStack = require('./resources/activity_map.json');

        fetchActivityMapStack.mockResolvedValueOnce(activityMapStack);

        const action = fetchAndAddActivityMapToViewer('activityMapID');

        await middleware(store)(next)(action);

        const expectedObject = new ActivityMap(
            'activityMapID',
            DEFAULT_COLOR,
            DEFAULT_OPACITY,
            DEFAULT_VISIBILITY,
            activityMapStack,
        );

        expect(store.dispatch).toHaveBeenCalledWith(addActivityMapToViewer(expectedObject));
    });

    it('should handle error during ADD_ACTIVITY_MAP_TO_VIEWER', async () => {
        const errorMessage = 'Some Error';
        fetchActivityMapStack.mockRejectedValueOnce(new Error(errorMessage));

        const action = fetchAndAddActivityMapToViewer('activityMapID');

        await middleware(store)(next)(action);

        expect(store.dispatch).toHaveBeenCalledWith(setError(errorMessage));
    });

    it('should handle DOWNLOAD_OBJECT', () => {
        const mockObjectID = '1';
        const mockObject = new ActivityMap(mockObjectID, 'red', 1, true, 'stack');

        // Mock the state of the store
        store.getState = jest.fn().mockReturnValue({
            viewer: {
                activityMaps: {
                    [mockObjectID]: mockObject
                },
                activityMapsOrder: [mockObjectID],

            }
        });

        middleware(store)(next)(triggerActivityMapDownload(mockObjectID));

        expect(downloadActivityMap).toHaveBeenCalledWith(mockObject);
    });

    // it('should handle DOWNLOAD_ALL_OBJECTS', () => {
    //     const mockObjects = {
    //         '1': new ActivityMap('1', 'Atlas', 'red', 1, true, 'stack1'),
    //         '2': new ActivityMap('2', 'Atlas', 'blue', 1, true, 'stack2'),
    //     };
    //
    //     // Mock the state of the store
    //     store.getState = jest.fn().mockReturnValue({
    //         viewer: {
    //             objects: mockObjects
    //         }
    //     });
    //
    //     middleware(store)(next)(triggerDownloadAllObjects());
    //
    //     expect(downloadAllViewerObjects).toHaveBeenCalledWith(Object.values(mockObjects));
    // });

});

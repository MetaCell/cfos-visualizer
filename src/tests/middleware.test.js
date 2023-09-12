import {middleware} from '../redux/middleware';
import {
    fetchModelStructure,
    fetchExperimentMetadata,
    fetchAtlasStack,
    fetchAtlasWireframeStack, fetchActivityMapStack, fetchLUTFile
} from '../services/fetchService';
import {
    fetchAndAddActivityMapToViewer, triggerDownloadAllObjects, triggerActivityMapDownload,
    fetchAndSetExperiment,
    fetchModel,
    setCurrentExperiment,
    setError,
    setModel, addActivityMapToViewer, fetchAndSetViewerAtlas, setViewerAtlas
} from "../redux/actions";
import {Experiment, ActivityMap, Atlas} from "../model/models";
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
    downloadAtlas: jest.fn(),
}));

describe('Middleware', () => {
    let store, next;
    const mockActivityMapID = 'ActivityMap1';


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

        const action = fetchAndSetExperiment(experimentID)

        await middleware(store)(next)(action);

        expect(store.dispatch).toHaveBeenCalledWith(setCurrentExperiment(new Experiment(experimentID, mockData)));
    });

    it('should handle error during FETCH_AND_SET_CURRENT_EXPERIMENT', async () => {
        const errorMessage = 'Experiment Error';
        fetchExperimentMetadata.mockRejectedValueOnce(new Error(errorMessage));

        const action = fetchAndSetExperiment('ExperimentID');
        await middleware(store)(next)(action);

        expect(store.dispatch).toHaveBeenCalledWith(setError(errorMessage));
    });

    it('should handle FETCH_AND_SET_VIEWER_ATLAS', async () => {
        const atlasID = 'AtlasID';
        const atlasStackData = require('./resources/atlasStack.msgpack');
        const atlasWireframeStackData = require('./resources/atlasWireframeStack.msgpack');

        fetchAtlasStack.mockResolvedValueOnce(atlasStackData);
        fetchAtlasWireframeStack.mockResolvedValueOnce(atlasWireframeStackData);

        const action = fetchAndSetViewerAtlas(atlasID)

        await middleware(store)(next)(action);

        const expectedAtlas = new Atlas(
            atlasID,
            DEFAULT_COLOR,
            DEFAULT_OPACITY,
            DEFAULT_VISIBILITY,
            atlasStackData,
            atlasWireframeStackData
        );

        expect(store.dispatch).toHaveBeenCalledWith(setViewerAtlas(expectedAtlas));
    });

    it('should handle error during FETCH_AND_SET_VIEWER_ATLAS for atlasStack', async () => {
        const errorMessage = 'Atlas Stack Error';
        fetchAtlasStack.mockRejectedValueOnce(new Error(errorMessage));

        const action = fetchAndSetViewerAtlas('AtlasID')
        await middleware(store)(next)(action);

        expect(store.dispatch).toHaveBeenCalledWith(setError(errorMessage));
    });

    it('should handle error during FETCH_AND_SET_VIEWER_ATLAS for atlasWireframeStack', async () => {
        const errorMessage = 'Atlas Wireframe Stack Error';
        fetchAtlasWireframeStack.mockRejectedValueOnce(new Error(errorMessage));
        fetchAtlasStack.mockResolvedValueOnce({}); // Resolve the previous fetch to simulate the next failure

        const action = fetchAndSetViewerAtlas('AtlasID')
        await middleware(store)(next)(action);

        expect(store.dispatch).toHaveBeenCalledWith(setError(errorMessage));
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
        const mockActivityMap = new ActivityMap(mockActivityMapID, 'red', 1, true, 'stack');

        // Mock the state of the store
        store.getState = jest.fn().mockReturnValue({
            viewer: {
                activityMaps: {
                    [mockActivityMapID]: mockActivityMap
                },
                order: [mockActivityMapID],

            }
        });

        middleware(store)(next)(triggerActivityMapDownload(mockActivityMapID));

        expect(downloadActivityMap).toHaveBeenCalledWith(mockActivityMap);
    });

    it('should handle DOWNLOAD_ALL_OBJECTS', () => {
        const mockActivityMaps = {
            [mockActivityMapID]: new ActivityMap(mockActivityMapID, 'red', 1, true, 'stack1'),
            'ActivityMap2': new ActivityMap('ActivityMap2', 'blue', 1, true, 'stack2'),
        };
        const atlasID = 'Atlas1'
        const atlas = new Atlas(atlasID, 'red', 1, true, 'stack', 'wireframeStack');



        store.getState = jest.fn().mockReturnValue({
            viewer: {
                activityMaps: mockActivityMaps,
                atlas: atlas
            }
        });

        middleware(store)(next)(triggerDownloadAllObjects());

        expect(downloadAllViewerObjects).toHaveBeenCalledWith(Object.keys(mockActivityMaps), atlasID)
    });

});

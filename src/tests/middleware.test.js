import { middleware } from '../redux/middleware';
import { fetchModelStructure, fetchExperimentMetadata } from '../services/fetchService';
import { actions } from '../redux/constants';
import {fetchExperiment, fetchModel, setCurrentExperiment, setError, setModel} from "../redux/actions";
import {Experiment} from "../model/models";

// Mocking the fetchService functions
jest.mock('../services/fetchService', () => ({
    fetchModelStructure: jest.fn(),
    fetchExperimentMetadata: jest.fn()
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

        const action = fetchModel()

        await middleware(store)(next)(action);

        expect(store.dispatch).toHaveBeenCalledWith(setModel(mockData));
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

});

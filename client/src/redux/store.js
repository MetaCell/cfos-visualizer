import componentMap from '../layout/componentMap';
import { middleware } from './middleware'
import baseLayout from '../layout/layout';
import { createStore } from '@metacell/geppetto-meta-client/common';
import { viewerReducer, currentExperimentReducer, modelReducer, uiReducer } from './reducers'
import {DEFAULT_LOADING_MESSAGE} from "../settings";

export const INIT_STATE = {
  viewer: {
    order: [],
    activityMaps: {},
    atlas: null,
    activityMapsIntensityRange: null,
  },
  currentExperiment: null,
  model: {
    ExperimentsAtlas: {},
    AtlasActivityMap: {},
    ExperimentsActivityMap: {},
    Lut: {},
    Atlases: {},
    ActivityMaps:{},
    ExperimentsMetadata:{}
  },
  ui: {
    isLoading: false,
    loadingMessage: DEFAULT_LOADING_MESSAGE,
    errors: null,
  }
}

const reducers = {
  viewer: viewerReducer,
  currentExperiment: currentExperimentReducer,
  model: modelReducer,
  ui: uiReducer
};

/**
 * The createStore function is used to initialize the redux store & configure the layout.
 *
 * You can build upon geppetto-meta's configuration by passing your own reducers, initial state and middlewares.
 */

const isMinimizeEnabled = false;

const store = createStore(
  reducers,
  INIT_STATE,
  [middleware],
  { undefined, baseLayout, componentMap, isMinimizeEnabled }
)

export default store;

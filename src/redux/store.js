import componentMap from '../app/componentMap';
import { exampleMiddleware } from './middleware'
import baseLayout from '../app/layout';
import { createStore } from '@metacell/geppetto-meta-client/common';
import exampleReducer from './reducer';

export const INIT_STATE = {
  viewer: {
    objects: {},
  },
  currentExperiment: null,
  model: {
    experimentsAtlas: {},
    atlasActivityMap: {},
    experimentsActivityMap: {},
    luts: {}
  },
  ui: {
    isLoading: false,
    errors: null,
  }
}

const reducers = {
  "exampleState": exampleReducer
};

/**
 * The createStore function is used to initialize the redux store & configure the layout.
 *
 * You can build upon geppetto-meta's configuration by passing your own reducers, initial state and middlewares.
 */
const store = createStore(
  reducers,
  INIT_STATE,
  [exampleMiddleware],
  { baseLayout, componentMap }
)

export default store;

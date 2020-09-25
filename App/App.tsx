/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useReducer } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import { Provider } from 'react-redux';
import DebugConfig from './Config/DebugConfig';
import {
  INITIAL_TAB_STATE,
  TabContext,
  tabReducer,
} from './Containers/MainApp/Home/Context';
import {
  INITIAL_STORY_STATE,
  StoryContext,
  storyReducer,
} from './Containers/Story/StoryContex';
import {
  AppContext,
  appReducer,
  INITIAL_APP_STATE,
} from './Contexts/AppContext';
import createStore from './Reducers';
import RootContainer from './RootContainer';
// create our store
const store = createStore();
/**
 * Note: This function should be called after redux-persist rehydration is complete
 *
 * See Services/Rehydration
 *
 * @method init
 *
 * @param {Store} store
 */
export const init = (store) => {};

const App: (props: any) => React$Node = () => {
  const [app, appDispatcher] = useReducer(appReducer, INITIAL_APP_STATE);
  const [tabIndex, dispatch] = useReducer(tabReducer, INITIAL_TAB_STATE);
  const [story, storyDispatcher] = useReducer(
    storyReducer,
    INITIAL_STORY_STATE,
  );

  return (
    <Provider store={store}>
      <AppContext.Provider
        value={{
          ...app,
          dispatch: appDispatcher,
        }}
      >
        <TabContext.Provider
          value={{
            ...tabIndex,
            dispatch,
          }}
        >
          <StoryContext.Provider
            value={{
              ...story,
              dispatch: storyDispatcher,
            }}
          >
            <MenuProvider>
              <RootContainer />
            </MenuProvider>
          </StoryContext.Provider>
        </TabContext.Provider>
      </AppContext.Provider>
    </Provider>
  );
};

export default DebugConfig.useReactotron ? console.tron.overlay(App) : App;

import AsyncStorage from '@react-native-community/async-storage';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import {
  AppState,
  AppStateStatus,
  Platform,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import TopBar from './Components/General/TopBar';
import Urls from './Constants/Urls';
import { AppContext } from './Contexts/AppContext';
import AuthenticationManager from './Lib/KeyChain/AuthenticationManager';
import AppNavigation from './Navigation/AppNavigation';
import NavigationService from './NavigationService';
import Api from './Services/Api';
import { mainAppStyles } from './styles';
import { Colors } from './Themes';
function RootContainer(props: any) {
  const appCtx = useContext(AppContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authManager = new AuthenticationManager();

  useEffect(() => {
    SplashScreen.hide();

    AsyncStorage.removeItem('email').then(() => {});
    AsyncStorage.removeItem('password').then(() => {});
  }, [appCtx.isAuthenticated]);

  function refreshToken() {
    Api({
      method: 'POST',
      url: Urls.auth.refresh,
    }).then((token) => {
      // AsyncStorage.setItem('token', token.data.accessToken).then(() => {});
      authManager
        .set(token.data.accessToken)
        .then(() => {
          appCtx.dispatch({
            type: 'IS_AUTHENTICATED',
            isAuthenticated: true,
          });
          NavigationService.navigate('MainApp');
        })
        .catch((error) => {
          authManager.remove().then(() => {
            NavigationService.navigate('Introduction');
            appCtx.dispatch({
              type: 'IS_AUTHENTICATED',
              isAuthenticated: false,
            });
          });
        });
    });
  }

  useEffect(() => {
    /** Locks app in portrait mode */
    /** Listen to the connection change and update it in App context */
    const unsubscribeNetInfo = NetInfo.addEventListener(
      (state: NetInfoState) => {
        appCtx.dispatch({
          type: 'CHANGE_CONNECTION',
          connected: state.isConnected,
        });
      },
    );

    /**
     * App state change callback - Called when state of the app changes.
     * Dismiss upload report dialog box on app state change
     *
     * @method handleAppStateChange
     *
     * @param {AppStateStatus} state
     *
     * @returns {void}
     */
    function handleAppStateChange(state: AppStateStatus) {
      if (appCtx.isAuthenticated) {
        if (state === 'active') {
          refreshToken();
        }
      }
      appCtx.dispatch({ type: 'CHANGE_APP_STATE', appState: state });
    }

    /** Listen to the state of app i.e. `active`, `inactive`, `background` */
    AppState.addEventListener('change', handleAppStateChange);

    /** Clean up all event listeners */
    return () => {
      unsubscribeNetInfo();
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [appCtx.isAuthenticated, appCtx.isContinueWithoutLogin]);

  return (
    <Fragment>
      <SafeAreaView
        style={{
          backgroundColor:
            appCtx.isAuthenticated || appCtx.isContinueWithoutLogin
              ? Colors.background
              : Colors.background,
        }}
      />
      <View style={mainAppStyles.container}>
        <StatusBar
          barStyle={
            Platform.OS === 'android'
              ? appCtx.isAuthenticated || appCtx.isContinueWithoutLogin
                ? 'dark-content'
                : 'dark-content'
              : 'dark-content'
          }
          backgroundColor={
            Platform.OS === 'android'
              ? appCtx.isAuthenticated || appCtx.isContinueWithoutLogin
                ? Colors.background
                : Colors.background
              : Colors.background
          }
        />
        {appCtx.isAuthenticated || appCtx.isContinueWithoutLogin ? (
          <TopBar NavigationService={NavigationService} />
        ) : null}

        <AppNavigation
          ref={(navigatorRef) => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </View>
    </Fragment>
  );
}

export default RootContainer;

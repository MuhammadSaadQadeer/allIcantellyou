import React, { Dispatch } from 'react';
import { AppStateStatus } from 'react-native';
import { IProfileData } from '../Containers/Profile/Profile';

interface IUser {
  description: string;
  author: {
    id: string;
    displayName: string;
    avatar: string;
    followed: boolean;
  };
}

// export interface ISearchResult {
//   diaryPosts: IDiaryFeed[];
//   posts: Articles[];
//   resources: [];
//   users: IUser[];
// }

export interface ISearchResult {
  diaryPosts: [];
  posts: [];
  resources: [];
  users: [];
}

export const CHANGE_CONNECTION = 'CHANGE_CONNECTION';
export const CHANGE_APP_STATE = 'CHANGE_APP_STATE';
export const IS_AUTHENTICATED = 'IS_AUTHENTICATED';
export const LOGIN_CREDENTIALS = 'LOGIN_CREDENTIALS';
export const LOGIN_PASSWORD = 'LOGIN_PASSWORD';
export const IS_CONTINUE_WITHOUT_LOGIN = 'IS_CONTINUE_WITHOUT_LOGIN';
export const SET_PROFILE_DATA = 'SET_PROFILE_DATA';
export const SET_SEARCH_RESULT = 'SET_SEARCH_RESULT';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export type AppActions =
  | { type: 'RESET_STATE' }
  | { type: 'IS_CONTINUE_WITHOUT_LOGIN'; isContinueWithoutLogin: boolean }
  | { type: 'LOGIN_PASSWORD'; loginPassword: string }
  | { type: 'CHANGE_CONNECTION'; connected: boolean }
  | { type: 'CHANGE_APP_STATE'; appState: AppStateStatus }
  | { type: 'LOGIN_CREDENTIALS'; lastLoggedInEmail: string }
  | { type: 'SET_PROFILE_DATA'; profileData: IProfileData }
  | { type: 'SET_SEARCH_RESULT'; searchResult: ISearchResult }
  | { type: 'CLEAR_SEARCH'; clearSearch: boolean }
  | { type: 'IS_AUTHENTICATED'; isAuthenticated: boolean };

export interface IAppState {
  lastLoggedInEmail: string;
  isConnected: boolean;
  appState: AppStateStatus | string;
  dispatch?: Dispatch<AppActions>;
  isAuthenticated: boolean;
  isContinueWithoutLogin: boolean;
  profileData: IProfileData;
  searchResult: ISearchResult;
  clearSearch: boolean;
  loginPassword: string;
}

export const INITIAL_APP_STATE = {
  searchResult: {
    diaryPosts: [],
    posts: [],
    resources: [],
    users: [],
  },
  clearSearch: false,
  lastLoggedInEmail: '',
  loginPassword: '',
  isConnected: true,
  appState: 'active',
  dispatch: () => {},
  isAuthenticated: false,
  isContinueWithoutLogin: false,
  profileData: {
    id: '',
    isAnonymous: false,
    isAdmin: false,
    newsSubscription: false,
    avatar: '',
    general: {
      email: '',
      displayName: '',
      firstName: '',
      lastName: '',
      description: '',
      birthday: '',
      pseudonim: '',
      phone: '',
      hometown: '',
    },
    visibility: {
      birthday: '',
      firstName: '',
      lastName: '',
      hometown: '',
      phone: '',
      description: '',
      avatar: '',
      interests: '',
      pseudonim: '',
      photos: '',
      email: '',
    },
    interests: [
      {
        id: '',
        title: '',
        question: '',
        values: [],
      },
    ],
    photos: [],
    bioAnswers: [],
    settings: {},
  },
};

export const appReducer = (state: IAppState, action: AppActions): IAppState => {
  switch (action.type) {
    case CHANGE_CONNECTION:
      return { ...state, isConnected: action.connected };
    case CHANGE_APP_STATE:
      return { ...state, appState: action.appState };
    case IS_AUTHENTICATED:
      return { ...state, isAuthenticated: action.isAuthenticated };
    case LOGIN_CREDENTIALS:
      return { ...state, lastLoggedInEmail: action.lastLoggedInEmail };
    case IS_CONTINUE_WITHOUT_LOGIN:
      return {
        ...state,
        isContinueWithoutLogin: action.isContinueWithoutLogin,
      };
    case SET_PROFILE_DATA:
      return {
        ...state,
        profileData: action.profileData,
      };
    case SET_SEARCH_RESULT:
      return {
        ...state,
        searchResult: action.searchResult,
      };
    case CLEAR_SEARCH:
      return {
        ...state,
        clearSearch: action.clearSearch,
      };

    case LOGIN_PASSWORD:
      return {
        ...state,
        loginPassword: action.loginPassword,
      };
    default:
      return INITIAL_APP_STATE;
  }
};

export const AppContext = React.createContext<IAppState>(INITIAL_APP_STATE);

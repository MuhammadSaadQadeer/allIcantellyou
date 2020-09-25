import React, { Dispatch } from 'react';
export const SET_TAB_NO = 'SET_TAB_NO';

export type ContextActions = { type: 'SET_TAB_NO'; tabNo: number };

export interface IContextState {
  tabNo: number;
  dispatch?: Dispatch<ContextActions>;
}

export const INITIAL_TAB_STATE = {
  tabNo: 1,
  dispatch: () => {},
};

export const tabReducer = (
  state: IContextState,
  action: ContextActions,
): IContextState => {
  switch (action.type) {
    case SET_TAB_NO:
      return { ...state, tabNo: action.tabNo };

    default:
      return INITIAL_TAB_STATE;
  }
};

export const TabContext = React.createContext<IContextState>(INITIAL_TAB_STATE);

import React, { Dispatch } from 'react';
export const FETCH_QUESTIONS = 'FETCH_QUESTIONS';

interface IQuestion {
  id: string;
  text: string;
  answered: boolean;
  category: string;
  collapsed: boolean;
}

interface IAnswer {
  id: string;
  answer: string;
  answeredAt: string;
  public: boolean;
  useFullName: boolean;
  question: {
    id: string;
    text: string;
    answered: boolean;
    category: string;
  };
}

interface IPostAnswerPayload {
  public: boolean;
  questionId: string;
  text: string;
  useFullName: boolean;
}

interface IMyStory {
  questions: IQuestion[];
  answers: IAnswer[];
}
export type IStoryActions = { type: 'FETCH_QUESTIONS'; myLifeStory: IMyStory };

export interface IStoryState {
  myLifeStory: IMyStory;
  dispatch?: Dispatch<IStoryActions>;
}

export const INITIAL_STORY_STATE = {
  myLifeStory: {
    questions: [],
    answers: [],
  },
  dispatch: () => {},
};

export const storyReducer = (
  state: IStoryState,
  action: IStoryActions,
): IStoryState => {
  switch (action.type) {
    case FETCH_QUESTIONS:
      return { ...state, myLifeStory: action.myLifeStory };

    default:
      return INITIAL_STORY_STATE;
  }
};

export const StoryContext = React.createContext<IStoryState>(
  INITIAL_STORY_STATE,
);

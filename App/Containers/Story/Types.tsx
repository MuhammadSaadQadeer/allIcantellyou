export interface IQuestion {
  id: string;
  text: string;
  answered: boolean;
  category: string;
}

export interface IAnswer {
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

export interface IMyStory {
  questions: IQuestion[];
  answers: IAnswer[];
}

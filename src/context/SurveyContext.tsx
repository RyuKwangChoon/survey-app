import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Survey, SurveyResponse } from '../types/survey';

interface Question {
  id: string;
  text: string;
  type: 'text' | 'single' | 'multiple';
  options?: string[];
}

interface SurveyContextType {
  surveys: Survey[];
  addSurvey: (survey: Survey) => void;
  updateSurvey: (survey: Survey) => void;
  deleteSurvey: (id: string) => void;
}

const initialSurvey: Survey = {
  id: '1',
  title: '사용자 만족도 설문',
  questions: [
    {
      id: '1',
      text: '이 서비스에 대해 어떻게 생각하시나요?',
      type: 'text'
    },
    {
      id: '2',
      text: '가장 선호하는 기능은 무엇인가요?',
      type: 'single',
      options: ['기능1', '기능2', '기능3', '기능4']
    },
    {
      id: '3',
      text: '개선이 필요한 부분은 무엇인가요?',
      type: 'multiple',
      options: ['UI/UX', '성능', '기능', '가격']
    }
  ]
};

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);

  const addSurvey = (survey: Survey) => {
    setSurveys([...surveys, survey]);
  };

  const updateSurvey = (survey: Survey) => {
    setSurveys(surveys.map(s => s.id === survey.id ? survey : s));
  };

  const deleteSurvey = (id: string) => {
    setSurveys(surveys.filter(s => s.id !== id));
  };

  return (
    <SurveyContext.Provider value={{ surveys, addSurvey, updateSurvey, deleteSurvey }}>
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
}; 
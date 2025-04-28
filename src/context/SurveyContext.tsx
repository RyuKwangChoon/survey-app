import React, { createContext, useContext, useState, useEffect } from 'react';
import { Survey, SurveyResponse } from '../types/survey';
import XLSX from 'xlsx';

interface Question {
  id: string;
  text: string;
  type: 'text' | 'single' | 'multiple';
  options?: string[];
}

interface SurveyContextType {
  surveys: Survey[];
  responses: SurveyResponse[];
  addSurvey: (survey: Survey) => void;
  updateSurvey: (survey: Survey) => void;
  deleteSurvey: (id: string) => void;
  addResponse: (response: SurveyResponse) => void;
  getResponsesBySurveyId: (surveyId: string) => SurveyResponse[];
  exportResponsesToExcel: (surveyId: string) => void;
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

export const SurveyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [surveys, setSurveys] = useState<Survey[]>(() => {
    const savedSurveys = localStorage.getItem('surveys');
    return savedSurveys ? JSON.parse(savedSurveys) : [];
  });

  const [responses, setResponses] = useState<SurveyResponse[]>(() => {
    const savedResponses = localStorage.getItem('responses');
    return savedResponses ? JSON.parse(savedResponses) : [];
  });

  useEffect(() => {
    localStorage.setItem('surveys', JSON.stringify(surveys));
  }, [surveys]);

  useEffect(() => {
    localStorage.setItem('responses', JSON.stringify(responses));
  }, [responses]);

  const addSurvey = (survey: Survey) => {
    setSurveys(prev => [...prev, survey]);
  };

  const updateSurvey = (survey: Survey) => {
    setSurveys(prev => prev.map(s => s.id === survey.id ? survey : s));
  };

  const deleteSurvey = (id: string) => {
    setSurveys(prev => prev.filter(s => s.id !== id));
    setResponses(prev => prev.filter(r => r.surveyId !== id));
  };

  const addResponse = (response: SurveyResponse) => {
    setResponses(prev => [...prev, response]);
  };

  const getResponsesBySurveyId = (surveyId: string) => {
    return responses.filter(r => r.surveyId === surveyId);
  };

  const exportResponsesToExcel = (surveyId: string) => {
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey) return;

    const surveyResponses = responses.filter(r => r.surveyId === surveyId);
    const worksheet = XLSX.utils.json_to_sheet(
      surveyResponses.map(response => {
        const rowData: Record<string, string> = {
          '응답 시간': new Date(parseInt(response.timestamp)).toLocaleString()
        };

        Object.entries(response.answers).forEach(([questionId, answer]) => {
          const question = survey.questions.find(q => q.id === questionId);
          if (question) {
            rowData[question.text] = Array.isArray(answer) ? answer.join(', ') : answer;
          }
        });

        return rowData;
      })
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '설문 결과');
    XLSX.writeFile(workbook, `${survey.title}_결과.xlsx`);
  };

  return (
    <SurveyContext.Provider value={{
      surveys,
      responses,
      addSurvey,
      updateSurvey,
      deleteSurvey,
      addResponse,
      getResponsesBySurveyId,
      exportResponsesToExcel
    }}>
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
export interface Survey {
  id: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'single' | 'multiple';
  options?: string[];
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: Record<string, string | string[]>;
  timestamp: string;
} 
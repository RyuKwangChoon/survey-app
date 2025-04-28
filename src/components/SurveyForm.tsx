import React, { useState } from 'react';
import { useSurvey } from '../context/SurveyContext';
import { SurveyResponse } from '../types/survey';
import './SurveyForm.css';

interface SurveyFormProps {
  surveyId: string;
  onComplete: () => void;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ surveyId, onComplete }) => {
  const { surveys, addResponse } = useSurvey();
  const survey = surveys.find(s => s.id === surveyId);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  if (!survey) return <div>설문을 찾을 수 없습니다.</div>;

  const handleAnswerChange = (value: string | string[]) => {
    const newAnswers = { ...answers };
    newAnswers[survey.questions[currentQuestionIndex].id] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const response: SurveyResponse = {
        id: Date.now().toString(),
        surveyId,
        timestamp: Date.now().toString(),
        answers
      };
      addResponse(response);
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const currentQuestion = survey.questions[currentQuestionIndex];

  return (
    <div className="survey-form">
      <h2>{survey.title}</h2>
      <div className="question">
        <h3>{currentQuestion.text}</h3>
        {currentQuestion.type === 'text' && (
          <input
            type="text"
            value={answers[currentQuestion.id] as string || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        )}
        {currentQuestion.type === 'single' && (
          <div className="options">
            {currentQuestion.options?.map((option, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={answers[currentQuestion.id] === option}
                  onChange={() => handleAnswerChange(option)}
                />
                {option}
              </label>
            ))}
          </div>
        )}
        {currentQuestion.type === 'multiple' && (
          <div className="options">
            {currentQuestion.options?.map((option, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={(answers[currentQuestion.id] as string[] || []).includes(option)}
                  onChange={(e) => {
                    const currentAnswers = answers[currentQuestion.id] as string[] || [];
                    const newAnswers = e.target.checked
                      ? [...currentAnswers, option]
                      : currentAnswers.filter(a => a !== option);
                    handleAnswerChange(newAnswers);
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        )}
      </div>
      <div className="navigation">
        {currentQuestionIndex > 0 && (
          <button onClick={handlePrevious}>이전</button>
        )}
        <button onClick={handleNext}>
          {currentQuestionIndex === survey.questions.length - 1 ? '완료' : '다음'}
        </button>
      </div>
    </div>
  );
};

export default SurveyForm; 
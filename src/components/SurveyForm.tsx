import React, { useState } from 'react';
import { useSurvey } from '../context/SurveyContext';
import './SurveyForm.css';

const SurveyForm: React.FC = () => {
  const { surveys } = useSurvey();
  const [currentSurveyIndex, setCurrentSurveyIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const currentSurvey = surveys[currentSurveyIndex];

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log('Form submitted:', answers);
  };

  if (!currentSurvey) {
    return <div>현재 진행 가능한 설문이 없습니다.</div>;
  }

  return (
    <div className="survey-form">
      <h2>{currentSurvey.title}</h2>
      <form onSubmit={handleSubmit}>
        {currentSurvey.questions.map(question => (
          <div key={question.id} className="question">
            <label>{question.text}</label>
            {question.type === 'text' && (
              <input
                type="text"
                value={answers[question.id] as string || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              />
            )}
            {question.type === 'single' && question.options && (
              <div className="options">
                {question.options.map(option => (
                  <label key={option}>
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
            {question.type === 'multiple' && question.options && (
              <div className="options">
                {question.options.map(option => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      value={option}
                      checked={(answers[question.id] as string[] || []).includes(option)}
                      onChange={(e) => {
                        const currentAnswers = answers[question.id] as string[] || [];
                        const newAnswers = e.target.checked
                          ? [...currentAnswers, option]
                          : currentAnswers.filter(a => a !== option);
                        handleAnswerChange(question.id, newAnswers);
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
        <button type="submit">제출하기</button>
      </form>
    </div>
  );
};

export default SurveyForm; 
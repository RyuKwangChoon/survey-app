import React from 'react';
import { useSurvey } from '../context/SurveyContext';

const SurveyResults: React.FC = () => {
  const { surveys } = useSurvey();

  return (
    <div className="survey-results">
      <h2>설문 결과</h2>
      
      {surveys.length === 0 ? (
        <p>아직 설문이 없습니다.</p>
      ) : (
        <div className="results-list">
          {surveys.map(survey => (
            <div key={survey.id} className="survey-result">
              <h3>{survey.title}</h3>
              <div className="questions-results">
                {survey.questions.map(question => (
                  <div key={question.id} className="question-result">
                    <h4>{question.text}</h4>
                    <p>질문 유형: {question.type}</p>
                    {question.options && (
                      <div className="options">
                        <p>선택지:</p>
                        <ul>
                          {question.options.map(option => (
                            <li key={option}>{option}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SurveyResults; 
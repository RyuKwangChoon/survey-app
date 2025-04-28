import React from 'react';
import { useSurvey } from '../context/SurveyContext';
import './SurveyResults.css';

interface SurveyResultsProps {
  surveyId: string;
}

const SurveyResults: React.FC<SurveyResultsProps> = ({ surveyId }) => {
  const { surveys, getResponsesBySurveyId, exportResponsesToExcel } = useSurvey();
  const survey = surveys.find(s => s.id === surveyId);
  const responses = getResponsesBySurveyId(surveyId);

  if (!survey) return <div>설문을 찾을 수 없습니다.</div>;

  return (
    <div className="survey-results">
      <h2>{survey.title} - 설문 결과</h2>
      <button onClick={() => exportResponsesToExcel(surveyId)}>Excel로 내보내기</button>
      
      <div className="results-summary">
        <p>총 응답 수: {responses.length}</p>
      </div>

      <div className="responses-list">
        {responses.map(response => (
          <div key={response.id} className="response-item">
            <p className="response-time">
              응답 시간: {new Date(parseInt(response.timestamp)).toLocaleString()}
            </p>
            <div className="answers">
              {Object.entries(response.answers).map(([questionId, answer]) => {
                const question = survey.questions.find(q => q.id === questionId);
                if (!question) return null;
                return (
                  <div key={questionId} className="answer">
                    <h4>{question.text}</h4>
                    <p>{Array.isArray(answer) ? answer.join(', ') : answer}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurveyResults; 
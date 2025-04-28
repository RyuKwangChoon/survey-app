import React, { useState } from 'react';
import { useSurvey } from '../context/SurveyContext';
import './SurveyManager.css';

const SurveyManager: React.FC = () => {
  const { surveys, addSurvey, deleteSurvey } = useSurvey();
  const [newSurvey, setNewSurvey] = useState({
    title: '',
    questions: [] as Array<{
      id: string;
      text: string;
      type: 'text' | 'single' | 'multiple';
      options?: string[];
    }>
  });

  const handleAddQuestion = () => {
    setNewSurvey(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: Date.now().toString(),
          text: '',
          type: 'text',
          options: []
        }
      ]
    }));
  };

  const handleQuestionChange = (index: number, field: string, value: string | string[]) => {
    setNewSurvey(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSurvey.title && newSurvey.questions.length > 0) {
      addSurvey({
        id: Date.now().toString(),
        ...newSurvey
      });
      setNewSurvey({
        title: '',
        questions: []
      });
    }
  };

  return (
    <div className="survey-manager">
      <h2>설문 관리</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>설문 제목</label>
          <input
            type="text"
            value={newSurvey.title}
            onChange={(e) => setNewSurvey(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        {newSurvey.questions.map((question, index) => (
          <div key={question.id} className="question-form">
            <div className="form-group">
              <label>질문 내용</label>
              <input
                type="text"
                value={question.text}
                onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>질문 유형</label>
              <select
                value={question.type}
                onChange={(e) => handleQuestionChange(index, 'type', e.target.value as 'text' | 'single' | 'multiple')}
              >
                <option value="text">텍스트</option>
                <option value="single">단일 선택</option>
                <option value="multiple">다중 선택</option>
              </select>
            </div>

            {(question.type === 'single' || question.type === 'multiple') && (
              <div className="form-group">
                <label>선택 항목 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={question.options?.join(', ') || ''}
                  onChange={(e) => handleQuestionChange(index, 'options', e.target.value.split(',').map(opt => opt.trim()))}
                  required
                />
              </div>
            )}
          </div>
        ))}

        <button type="button" onClick={handleAddQuestion}>질문 추가</button>
        <button type="submit">설문 저장</button>
      </form>

      <div className="survey-list">
        <h3>저장된 설문 목록</h3>
        {surveys.map(survey => (
          <div key={survey.id} className="survey-item">
            <h4>{survey.title}</h4>
            <p>질문 수: {survey.questions.length}</p>
            <button onClick={() => deleteSurvey(survey.id)}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurveyManager; 
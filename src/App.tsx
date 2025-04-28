import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import SurveyForm from './components/SurveyForm';
import SurveyManager from './components/SurveyManager';
import SurveyResults from './components/SurveyResults';
import { SurveyProvider } from './context/SurveyContext';
import './components/SurveyForm.css';
import './components/SurveyManager.css';
import './components/SurveyResults.css';
import './App.css';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="navigation">
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>설문 참여</Link>
      <Link to="/manage" className={location.pathname === '/manage' ? 'active' : ''}>설문 관리</Link>
      <Link to="/results" className={location.pathname === '/results' ? 'active' : ''}>설문 결과</Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <SurveyProvider>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-900">설문조사 시스템</h1>
              <Navigation />
            </div>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<SurveyForm surveyId="1" onComplete={() => {}} />} />
              <Route path="/manage" element={<SurveyManager />} />
              <Route path="/results" element={<SurveyResults surveyId="1" />} />
            </Routes>
          </main>
        </div>
      </SurveyProvider>
    </Router>
  );
}

export default App;

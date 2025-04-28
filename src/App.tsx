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
    <SurveyProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>설문 조사 앱</h1>
            <Navigation />
          </header>
          <main>
            <Routes>
              <Route path="/" element={<SurveyForm />} />
              <Route path="/manage" element={<SurveyManager />} />
              <Route path="/results" element={<SurveyResults />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SurveyProvider>
  );
}

export default App;

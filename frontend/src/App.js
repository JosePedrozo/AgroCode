import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import CattleForm from './components/CattleForm';
import LoginForm from './components/LoginForm';
import CattleList from './components/CattleList';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/cadastrar" element={<CattleForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/listar" element={<CattleList />} />
      </Routes>
    </Router>
  );
}

export default App;

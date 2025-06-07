import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Welcome from './components/Welcome';
import CattleForm from './components/CattleForm';
import LoginForm from './components/LoginForm';
import UserRegister from './components/UserRegister';
import CattleList from './components/CattleList';
import About from './components/About';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/listar" element={<CattleList />} />
        <Route path="/registrar-animal" element={<CattleForm />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/cadastro" element={<UserRegister />} />
      </Routes>
    </Router>
  );
}

export default App;

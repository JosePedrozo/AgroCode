import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Welcome from './components/Welcome';
import CattleForm from './components/CattleForm';
import LoginForm from './components/Login';
import UserRegister from './components/UserRegister';
import CattleList from './components/CattleList';
import About from './components/About';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/animal/lista" element={<CattleList />} />
        <Route path="/animal/cadastrar" element={<CattleForm isEditMode={false} />} />
        <Route path="/animal/editar/:id" element={<CattleForm isEditMode={true} />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/cadastro" element={<UserRegister />} />
        <Route path="/entrar" element={<Welcome />}/>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;

import React, { useState } from 'react';
import './UserRegister.scss';

const UserRegister = () => {
  const [tipo, setTipo] = useState('fisica');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    cnpj: '',
    nomeEmpresa: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTipoChange = (e) => {
    setTipo(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      tipo,
      ...(tipo === 'fisica'
        ? {
            nome: formData.nome,
            cpf: formData.cpf,
            email: formData.email,
            senha: formData.senha,
          }
        : {
            nomeEmpresa: formData.nomeEmpresa,
            cnpj: formData.cnpj,
            email: formData.email,
            senha: formData.senha,
          }),
    };

    try {
      const response = await fetch('http://localhost:3001/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Usuário cadastrado com sucesso!');
      } else {
        alert('Erro ao cadastrar usuário.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }
  };

  return (
    <div className="user-register">
      <h2>Cadastro de Usuário</h2>
      <form onSubmit={handleSubmit}>
        <div className="tipo">
          <label>
            <input
              type="radio"
              name="tipo"
              value="fisica"
              checked={tipo === 'fisica'}
              onChange={handleTipoChange}
            />
            Pessoa Física
          </label>
          <label>
            <input
              type="radio"
              name="tipo"
              value="juridica"
              checked={tipo === 'juridica'}
              onChange={handleTipoChange}
            />
            Pessoa Jurídica
          </label>
        </div>

        {tipo === 'fisica' ? (
          <>
            <input
              type="text"
              name="nome"
              placeholder="Nome completo"
              value={formData.nome}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="cpf"
              placeholder="CPF"
              value={formData.cpf}
              onChange={handleChange}
              required
            />
          </>
        ) : (
          <>
            <input
              type="text"
              name="nomeEmpresa"
              placeholder="Nome da empresa"
              value={formData.nomeEmpresa}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="cnpj"
              placeholder="CNPJ"
              value={formData.cnpj}
              onChange={handleChange}
              required
            />
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={formData.senha}
          onChange={handleChange}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default UserRegister;

import React, { useState } from 'react';
import './CattleForm.scss';

const CattleForm = () => {
  const [formData, setFormData] = useState({
    matriz: '',
    reprodutor: '',
    coberturaData: '',
    nascimento: '',
    sexo: '',
    brinco: '',
    previsaoParto: '',
    numeroBezerro: '',
    raca: '',
  });

  const racas = ['Angus', 'Brangus', 'Ultrabeck', 'Outros'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch('http://localhost:3001/api/animal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert('Animal cadastrado com sucesso!');
      setFormData({
        matriz: '',
        reprodutor: '',
        coberturaData: '',
        nascimento: '',
        sexo: '',
        brinco: '',
        previsaoParto: '',
        numeroBezerro: '',
        raca: '',
      });
    } else {
      alert('Erro ao cadastrar animal');
    }
    } catch (err) {
      console.error('Erro ao enviar formulário:', err);
      alert('Erro ao conectar com o servidor');
    }
  };


  return (
    <form className="cattle-form" onSubmit={handleSubmit}>
      <h2>Cadastro de Animal</h2>

      <label htmlFor="matriz">Matriz Nº</label>
      <input name="matriz" value={formData.matriz} onChange={handleChange} />

      <label htmlFor="reprodutor">Reprodutor Nº</label>
      <input name="reprodutor" value={formData.reprodutor} onChange={handleChange} />

      <label htmlFor="coberturaData">Data da Cobertura</label>
      <input type="date" name="coberturaData" value={formData.coberturaData} onChange={handleChange} />

      <label htmlFor="nascimento">Data de Nascimento</label>
      <input type="date" name="nascimento" value={formData.nascimento} onChange={handleChange} />

      <label htmlFor="sexo">Sexo</label>
      <select name="sexo" value={formData.sexo} onChange={handleChange}>
        <option value="">Selecione</option>
        <option value="M">Macho</option>
        <option value="F">Fêmea</option>
      </select>

      <label htmlFor="brinco">Brinco</label>
      <input name="brinco" value={formData.brinco} onChange={handleChange} />

      <label htmlFor="previsaoParto">Previsão de Parto</label>
      <input type="date" name="previsaoParto" value={formData.previsaoParto} onChange={handleChange} />

      <label htmlFor="numeroBezerro">Número do Bezerro</label>
      <input name="numeroBezerro" value={formData.numeroBezerro} onChange={handleChange} />

      <label htmlFor="raca">Raça</label>
      <select name="raca" value={formData.raca} onChange={handleChange}>
        <option value="">Selecione</option>
        {racas.map((raca) => (
          <option key={raca} value={raca}>{raca}</option>
        ))}
      </select>

      <button type="submit">Cadastrar</button>
    </form>
  );
};

export default CattleForm;

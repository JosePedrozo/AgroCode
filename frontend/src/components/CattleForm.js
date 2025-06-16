import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CattleForm.scss';

const CattleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    reprodutor_n: '',
    matriz_n: '',
    cobertura_data: '',
    previsao_parto: '',
    nascimento: '',
    numero_bezerro: '',
    peso: '',
    sexo: '',
    raca: '',
  });

  const racas = ['Angus', 'Brangus', 'Ultrabeck', 'Outros'];

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/api/animal/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Animal não encontrado');
          return res.json();
        })
        .then((data) => {
          // Converte datas para formato compatível com input type="date"
          const formatDate = (date) => date ? date.slice(0, 10) : '';
          setFormData({
            reprodutor_n: data.reprodutor_n || '',
            matriz_n: data.matriz_n || '',
            cobertura_data: formatDate(data.cobertura_data),
            previsao_parto: formatDate(data.previsao_parto),
            nascimento: formatDate(data.nascimento),
            numero_bezerro: data.numero_bezerro || '',
            peso: data.peso || '',
            sexo: data.sexo || '',
            raca: data.raca || '',
          });
        })
        .catch((err) => {
          console.error(err);
          alert('Erro ao carregar dados do animal.');
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = id
      ? `http://localhost:3001/api/animal/${id}`
      : 'http://localhost:3001/api/animal';
    const method = id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(id ? 'Animal atualizado com sucesso!' : 'Animal cadastrado com sucesso!');
        navigate('/animal/lista');
      } else {
        alert('Erro ao salvar animal');
      }
    } catch (err) {
      console.error('Erro ao enviar formulário:', err);
      alert('Erro ao conectar com o servidor');
    }
  };

  return (
    <form className="cattle-form" onSubmit={handleSubmit}>
      <h2>{id ? 'Editar Animal' : 'Cadastro de Animal'}</h2>

      <label htmlFor="reprodutor_n">Reprodutor Nº</label>
      <input name="reprodutor_n" value={formData.reprodutor_n} onChange={handleChange} />

      <label htmlFor="matriz_n">Matriz Nº</label>
      <input name="matriz_n" value={formData.matriz_n} onChange={handleChange} />

      <label htmlFor="cobertura_data">Data da Cobertura</label>
      <input type="date" name="cobertura_data" value={formData.cobertura_data} onChange={handleChange} />

      <label htmlFor="previsao_parto">Previsão de Parto</label>
      <input type="date" name="previsao_parto" value={formData.previsao_parto} onChange={handleChange} />

      <label htmlFor="nascimento">Data de Nascimento</label>
      <input type="date" name="nascimento" value={formData.nascimento} onChange={handleChange} />

      <label htmlFor="numero_bezerro">Número do Bezerro</label>
      <input name="numero_bezerro" value={formData.numero_bezerro} onChange={handleChange} />

      <label htmlFor="peso">Peso</label>
      <input type="number" step="0.01" name="peso" value={formData.peso} onChange={handleChange} />

      <label htmlFor="sexo">Sexo</label>
      <select name="sexo" value={formData.sexo} onChange={handleChange}>
        <option value="" disabled hidden>Selecione</option>
        <option value="M">Macho</option>
        <option value="F">Fêmea</option>
      </select>

      <label htmlFor="raca">Raça</label>
      <select name="raca" value={formData.raca} onChange={handleChange}>
        <option value="">Selecione</option>
        {racas.map((raca) => (
          <option key={raca} value={raca}>{raca}</option>
        ))}
      </select>

      <button type="submit">{id ? 'Salvar Alterações' : 'Cadastrar'}</button>
    </form>
  );
};

export default CattleForm;

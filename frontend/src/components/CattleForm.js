import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CattleForm.scss';

const CattleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tipo_bezerro: 'vivo',
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
          const formatDate = (date) => date ? date.slice(0, 10) : '';
          setFormData({
            tipo_bezerro: data.tipo_bezerro || 'vivo',
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

      {/* Tipo de Bezerro */}
      <label>Tipo de Bezerro</label>
      <div className="tipo-bezerro-options">
        <label>
          <input
            type="radio"
            name="tipo_bezerro"
            value="vivo"
            checked={formData.tipo_bezerro === 'vivo'}
            onChange={handleChange}
          />
          Bezerro Vivo
        </label>
        <label>
          <input
            type="radio"
            name="tipo_bezerro"
            value="previsto"
            checked={formData.tipo_bezerro === 'previsto'}
            onChange={handleChange}
          />
          Bezerro Previsto
        </label>
      </div>

      {/* Campos comuns */}
      <label htmlFor="reprodutor_n">Reprodutor Nº</label>
      <input name="reprodutor_n" value={formData.reprodutor_n} onChange={handleChange} />

      <label htmlFor="matriz_n">Matriz Nº</label>
      <input name="matriz_n" value={formData.matriz_n} onChange={handleChange} />

      <label htmlFor="cobertura_data">Data da Cobertura</label>
      <input type="date" name="cobertura_data" value={formData.cobertura_data} onChange={handleChange} />

      {/* Condicional */}
      {formData.tipo_bezerro === 'vivo' ? (
        <>
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
        </>
      ) : (
        <>
          <label htmlFor="previsao_parto">Previsão de Parto</label>
          <input type="date" name="previsao_parto" value={formData.previsao_parto} onChange={handleChange} />
        </>
      )}

      <button type="submit">{id ? 'Salvar Alterações' : 'Cadastrar'}</button>
    </form>
  );
};

export default CattleForm;

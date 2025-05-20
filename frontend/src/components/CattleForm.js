import React, { useState, useEffect } from 'react';
import './CattleForm.scss';

function CattleForm() {
  const [formData, setFormData] = useState({
    brinco: '',
    nome: '',
    raca: '',
    sexo: '',
    nascimento: '',
    peso: '',
    categoria: '',
    situacao: '',
    observacoes: '',
    pai: '',
    mae: ''
  });

  const [categorias, setCategorias] = useState([]);
  const [racas, setRacas] = useState([]);
  const [situacoes, setSituacoes] = useState([]);
  const [brincosPai, setBrincosPai] = useState([]);
  const [brincosMae, setBrincosMae] = useState([]);

  // Carregar dados estáticos
  useEffect(() => {
    fetch('http://localhost:3001/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(error => console.error('Erro ao carregar categorias:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/racas')
      .then(res => res.json())
      .then(data => setRacas(data))
      .catch(error => console.error('Erro ao carregar raças:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/situacoes')
      .then(res => res.json())
      .then(data => setSituacoes(data))
      .catch(error => console.error('Erro ao carregar situações:', error));
  }, []);

  // Buscar brincos com debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (formData.pai) {
        buscarBrincos(formData.pai, 'pai');
      } else {
        setBrincosPai([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [formData.pai]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (formData.mae) {
        buscarBrincos(formData.mae, 'mae');
      } else {
        setBrincosMae([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [formData.mae]);

  const buscarBrincos = async (q, tipo) => {
    try {
      const res = await fetch(`http://localhost:3001/matriz/buscar-brincos?q=${q}`);
      const data = await res.json();
      if (tipo === 'pai') setBrincosPai(data);
      else setBrincosMae(data);
    } catch (error) {
      console.error('Erro ao buscar brincos:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:3001/animal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (!response.ok) {
      alert('Erro ao cadastrar animal: ' + result.erro);
      return;
    }

    // Se for matriz, também salva na tabela matriz
    if (formData.categoria.toLowerCase() === 'matriz') {
      const resMatriz = await fetch('http://localhost:3001/matriz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brinco: formData.brinco })
      });

      const resultMatriz = await resMatriz.json();
      if (!resMatriz.ok) {
        alert('Erro ao cadastrar matriz: ' + resultMatriz.erro);
        return;
      }
    }

      alert('Animal cadastrado com sucesso!');
      setFormData({
        brinco: '', nome: '', raca: '', sexo: '', nascimento: '',
        peso: '', categoria: '', situacao: '', observacoes: '',
        pai: '', mae: ''
      });

    } catch (error) {
      alert('Erro de conexão com o servidor.');
      console.error(error);
    }
  };

  return (
    <form className="cattle-form" onSubmit={handleSubmit} autoComplete="off">
      <h2>Cadastrar Animal</h2>
      <input name="brinco" placeholder="Brinco" value={formData.brinco} onChange={handleChange} required autoComplete="off" />
      <input name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} autoComplete="off" />
      
      <select name="raca" value={formData.raca} onChange={handleChange} required>
        <option value="">Selecione a raça</option>
        {racas.map((r) => (
          <option key={r.id} value={r.nome}>{r.nome}</option>
        ))}
      </select>

      <select name="sexo" value={formData.sexo} onChange={handleChange} required>
        <option value="">Sexo</option>
        <option value="macho">Macho</option>
        <option value="femea">Fêmea</option>
      </select>

      <input name="nascimento" type="date" value={formData.nascimento} onChange={handleChange} required autoComplete="off" />
      <input name="peso" type="number" placeholder="Peso (kg)" value={formData.peso} onChange={handleChange} autoComplete="off" />

      <select name="categoria" value={formData.categoria} onChange={handleChange} required>
        <option value="">Selecione a categoria</option>
        {categorias.map((cat) => (
          <option key={cat.id} value={cat.nome}>{cat.nome}</option>
        ))}
      </select>

      <select name="situacao" value={formData.situacao} onChange={handleChange}>
        <option value="">Selecione a situação</option>
        {situacoes.map((s) => (
          <option key={s.id} value={s.nome}>{s.nome}</option>
        ))}
      </select>

      <input name="observacoes" placeholder="Observações" value={formData.observacoes} onChange={handleChange} autoComplete="off" />

      {/* Brinco do pai */}
      <input
        name="pai"
        placeholder="Brinco do Pai"
        value={formData.pai}
        onChange={handleChange}
        list="lista-pai"
        autoComplete="off"
      />
      <datalist id="lista-pai">
        {brincosPai.map((b) => (
          <option key={b.brinco} value={b.brinco} />
        ))}
      </datalist>

      {/* Brinco da mãe */}
      <input
        name="mae"
        placeholder="Brinco da Mãe"
        value={formData.mae}
        onChange={handleChange}
        list="lista-mae"
        autoComplete="off"
      />
      <datalist id="lista-mae">
        {brincosMae.map((b) => (
          <option key={b.brinco} value={b.brinco} />
        ))}
      </datalist>

      <button type="submit">Cadastrar</button>
    </form>
  );
}

export default CattleForm;

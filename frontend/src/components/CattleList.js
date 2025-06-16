import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CattleList.scss';

const CattleList = () => {
  const [animais, setAnimais] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnimais = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/animal');
        const data = await response.json();
        setAnimais(data);
      } catch (error) {
        console.error('Erro ao buscar animais:', error);
      }
    };

    fetchAnimais();
  }, []);

  const formatarData = (dataISO) => {
    if (!dataISO) return '-';
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  };

  const handleRowClick = (id) => {
    navigate(`/animal/editar/${id}`);
  };

  return (
    <div className="cattle-list">
      <h2>Listagem do rebanho</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Reprodutor Nº</th>
              <th>Matriz Nº</th>
              <th>Data Cobertura</th>
              <th>Previsão Parto</th>
              <th>Data Nascimento</th>
              <th>Bezerro(a) Nº</th>
              <th>Peso</th>
              <th>Sexo</th>
              <th>Raça</th>
            </tr>
          </thead>
          <tbody>
            {animais.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '1rem', fontStyle: 'italic', color: '#888' }}>
                  Sem dados, registre um animal para começar
                </td>
              </tr>
            ) : (
              animais.map((animal) => (
                <tr key={animal.id} onClick={() => handleRowClick(animal.id)} style={{ cursor: 'pointer' }}>
                  <td>{animal.reprodutor_n || '-'}</td>
                  <td>{animal.matriz_n || '-'}</td>
                  <td>{formatarData(animal.cobertura_data)}</td>
                  <td>{formatarData(animal.previsao_parto)}</td>
                  <td>{formatarData(animal.nascimento)}</td>
                  <td>{animal.numero_bezerro || '-'}</td>
                  <td>{animal.peso ? `${animal.peso} kg` : '-'}</td>
                  <td>{animal.sexo || '-'}</td>
                  <td>{animal.raca || '-'}</td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default CattleList;

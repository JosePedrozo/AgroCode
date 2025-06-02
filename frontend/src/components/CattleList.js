import React, { useEffect, useState } from 'react';
import './CattleList.scss';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

const CattleList = () => {
  const [animais, setAnimais] = useState([]);

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

  return (
    <div className="cattle-list">
      <h2>Animais Cadastrados</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Matriz Nº</th>
              <th>Reprodutor Nº</th>
              <th>Data Cobertura</th>
              <th>Data Nascimento</th>
              <th>Sexo</th>
              <th>Brinco</th>
              <th>Previsão Parto</th>
              <th>Bezerro Nº</th>
              <th>Raça</th>
            </tr>
          </thead>
          <tbody>
            {animais.map((animal) => (
              <tr key={animal.id}>
                <td>{animal.matriz_n}</td>
                <td>{animal.reprodutor_n}</td>
                <td>{formatDate(animal.cobertura_data)}</td>
                <td>{formatDate(animal.nascimento)}</td>
                <td>{animal.sexo}</td>
                <td>{animal.brinco}</td>
                <td>{formatDate(animal.previsao_parto)}</td>
                <td>{animal.numero_bezerro}</td>
                <td>{animal.raca}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CattleList;

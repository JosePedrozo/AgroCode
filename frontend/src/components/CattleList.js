import React, { useEffect, useState } from 'react';
import './CattleList.scss';

function CattleList() {
  const [animais, setAnimais] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/animal')
      .then(response => response.json())
      .then(data => setAnimais(data))
      .catch(error => console.error('Erro ao carregar animais:', error));
  }, []);

  return (
    <div className="cattle-list">
      <h2>Lista de Animais</h2>
      <table>
        <thead>
          <tr>
            <th>Brinco</th>
            <th>Nome</th>
            <th>Raça</th>
            <th>Sexo</th>
            <th>Nascimento</th>
            <th>Peso</th>
            <th>Categoria</th>
            <th>Situação</th>
            <th>Pai</th>
            <th>Mãe</th>
          </tr>
        </thead>
        <tbody>
          {animais.map(animal => (
            <tr key={animal.brinco}>
              <td>{animal.brinco}</td>
              <td>{animal.nome}</td>
              <td>{animal.raca}</td>
              <td>{animal.sexo}</td>
              <td>{new Date(animal.nascimento).toLocaleDateString()}</td>
              <td>{animal.peso} kg</td>
              <td>{animal.categoria}</td>
              <td>{animal.situacao}</td>
              <td>{animal.pai}</td>
              <td>{animal.mae}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CattleList;

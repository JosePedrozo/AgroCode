const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Configuração da conexão com o banco PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ruralcode',
  password: '123',
  port: 5432,
});

// Rotas da API (devem ficar antes do serve estático do React)

// Rota para inserir um animal
app.post('/api/animal', async (req, res) => {
  try {
    const {
      matriz,
      reprodutor,
      coberturaData,
      nascimento,
      sexo,
      brinco,
      previsaoParto,
      numeroBezerro,
      raca,
    } = req.body;

    const query = `
      INSERT INTO animal (
        matriz_n, reprodutor_n, cobertura_data, nascimento,
        sexo, brinco, previsao_parto, numero_bezerro, raca
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [
      matriz,
      reprodutor,
      coberturaData,
      nascimento,
      sexo,
      brinco,
      previsaoParto,
      numeroBezerro,
      raca,
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao salvar animal:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Rota para listar todos os animais
app.get('/api/animal', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM animal ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar animais:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Serve arquivos estáticos do React (build)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// Rota fallback para SPA React - serve index.html para todas as rotas que não começam com /api
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

// Porta do servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

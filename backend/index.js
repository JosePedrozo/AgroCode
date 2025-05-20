const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Configuração da conexão com o banco de dados PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ruralcode',
  password: '123',
  port: 5432,
});

// // Rota de teste
// app.get('/', (req, res) => {
//   res.send('API do RuralCode funcionando!');
// });

const path = require('path');


// Rota para listar todos os animal
app.get('/animal', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM animal ORDER BY nascimento DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar animal:', error);
    res.status(500).json({ erro: 'Erro ao buscar animal.' });
  }
});

// Rota para buscar raças
app.get('/racas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM raca ORDER BY nome ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar raças:', error);
    res.status(500).json({ erro: 'Erro ao buscar raças.' });
  }
});

// Rota para buscar categorias
app.get('/categorias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categoria ORDER BY nome ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ erro: 'Erro ao buscar categorias.' });
  }
});

// Rota para buscar todas as situações
app.get('/situacoes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM situacao ORDER BY nome ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar situações:', error);
    res.status(500).json({ erro: 'Erro ao buscar situações.' });
  }
});

// Buscar brincos de animais que são matriz (para pai e mãe)
app.get('/matriz/buscar-brincos', async (req, res) => {
  const { q } = req.query;

  try {
    const result = await pool.query(
      'SELECT brinco FROM matriz WHERE brinco ILIKE $1 LIMIT 10',
      [`${q}%`]  // <-- aqui está o segredo: começa com `q`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar brincos na tabela matriz:', error);
    res.status(500).json({ erro: 'Erro ao buscar brincos' });
  }
});

// Serve os arquivos estáticos do React
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Cuidado com esta linha!
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});


// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// Rota para cadastrar matriz
app.post('/matriz', async (req, res) => {
  const { brinco } = req.body;

  if (!brinco) {
    return res.status(400).json({ erro: 'Brinco é obrigatório' });
  }

  try {
    await pool.query('INSERT INTO matriz (brinco) VALUES ($1)', [brinco]);
    res.status(201).json({ mensagem: 'Brinco inserido na tabela matriz com sucesso' });
  } catch (error) {
    console.error('Erro ao inserir na tabela matriz:', error);
    res.status(500).json({ erro: 'Erro ao inserir matriz' });
  }
});

// Rota para cadastrar um novo animal
app.post('/animal', async (req, res) => {
  const {
    brinco, nome, raca, sexo, nascimento,
    peso, categoria, situacao, observacoes,
    pai, mae
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO animal (
        brinco, nome, raca, sexo, nascimento,
        peso, categoria, situacao, observacoes,
        pai, mae
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        brinco, nome, raca, sexo, nascimento,
        peso, categoria, situacao, observacoes,
        pai, mae
      ]
    );

    res.status(201).json({
      mensagem: 'Animal cadastrado com sucesso!',
      animal: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao cadastrar animal:', error);
    res.status(500).json({ erro: 'Erro ao cadastrar animal.' });
  }
});


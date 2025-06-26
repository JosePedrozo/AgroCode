const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const validator = require('validator');

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ruralcode',
  password: '123',
  port: 5432,
});

// Limite de tentativas para proteger contra brute-force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo de 10 tentativas por IP
  message: 'Muitas tentativas de login. Tente novamente mais tarde.'
});

// Rota para inserir um animal
app.post('/api/animal', async (req, res) => {
  try {
    const campos = [
      'reprodutor_n', 'matriz_n', 'cobertura_data', 'previsao_parto',
      'nascimento', 'numero_bezerro', 'peso', 'sexo', 'raca'
    ];

    const dados = campos.reduce((acc, campo) => {
      if (req.body[campo] !== undefined && req.body[campo] !== '') {
        acc[campo] = req.body[campo];
      }
      return acc;
    }, {});

    if (Object.keys(dados).length === 0) {
      return res.status(400).json({ error: 'Nenhum dado fornecido' });
    }

    const keys = Object.keys(dados);
    const values = Object.values(dados);
    const params = keys.map((_, idx) => `$${idx + 1}`);

    const query = `INSERT INTO animal (${keys.join(', ')}) VALUES (${params.join(', ')}) RETURNING *;`;

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao salvar animal:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

app.get('/api/animal', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, reprodutor_n, matriz_n, cobertura_data, previsao_parto, 
        nascimento, numero_bezerro, peso, sexo, raca, criado_em
      FROM animal ORDER BY id DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar animais:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

app.get('/api/animal/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM animal WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Animal não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar animal por ID:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

app.put('/api/animal/:id', async (req, res) => {
  try {
    const campos = [
      'reprodutor_n', 'matriz_n', 'cobertura_data', 'previsao_parto',
      'nascimento', 'numero_bezerro', 'peso', 'sexo', 'raca'
    ];

    const dados = campos.reduce((acc, campo) => {
      if (req.body.hasOwnProperty(campo)) {
        acc[campo] = req.body[campo] === '' ? null : req.body[campo];
      }
      return acc;
    }, {});

    if (Object.keys(dados).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }

    const sets = Object.keys(dados).map((campo, i) => `${campo} = $${i + 1}`);
    const values = Object.values(dados);

    const query = `UPDATE animal SET ${sets.join(', ')} WHERE id = $${values.length + 1} RETURNING *;`;

    const result = await pool.query(query, [...values, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar animal:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Cadastro de usuários com senha criptografada e validação
app.post('/api/usuarios', async (req, res) => {
  const { tipo, nome, cpf, nomeEmpresa, cnpj, email, senha } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  if (!senha || senha.length < 8) {
    return res.status(400).json({ error: 'Senha fraca. Use pelo menos 8 caracteres.' });
  }

  try {
    const hashedSenha = await bcrypt.hash(senha, 12);

    if (tipo === 'fisica') {
      await pool.query(
        'INSERT INTO usuario (tipo, nome, cpf, email, senha) VALUES ($1, $2, $3, $4, $5)',
        ['fisica', nome, cpf, email, hashedSenha]
      );
    } else {
      await pool.query(
        'INSERT INTO usuario (tipo, nome_empresa, cnpj, email, senha) VALUES ($1, $2, $3, $4, $5)',
        ['juridica', nomeEmpresa, cnpj, email, hashedSenha]
      );
    }

    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// Rota de login com verificação de senha e limiter
app.post('/api/login', loginLimiter, async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
    const usuario = result.rows[0];

    if (usuario && await bcrypt.compare(senha, usuario.senha)) {
      res.status(200).json({ mensagem: 'Login realizado com sucesso', usuario });
    } else {
      res.status(401).json({ erro: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ erro: 'Erro no servidor durante o login' });
  }
});

// Serve arquivos estáticos do React
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

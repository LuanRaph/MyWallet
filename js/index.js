require('dotenv').config();
const express = require("express");
const path = require('path');
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(express.static('.'));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

function autenticar(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ erro: 'Token não fornecido!' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (err) {
        res.status(403).json({ erro: 'Token inválido!' });
    }
}


app.post('/cadastro', async (req, res) =>  {
    const { nome, email, senha} = req.body;

    try {
        const senhaCript = await bcrypt.hash(senha, 10);
        const result = await pool.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email',
            [nome, email, senhaCript]
        );
        res.json({ mensagem: 'Usuario clicado', usuario: result.rows[0] });
    } catch (err) {
        res.status(400).json({ erro: 'Email cadastrado' });
    }
});

app.post('/login', async(req, res) => {
    const { email, senha } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1', [email]
        );
        const usuario = result.rows[0];
        if (!usuario) return res.status(401).json({ erro: 'Email ou senha invalidos'});
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) return res.status(401).json({ erro: 'Email ou senha invalidos' });
        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );
        res.json({ token, nome: usuario.nome });
    } catch (err) {
        res.status(500).json({ erro: 'Erro no servidor' });
    }
})

app.get('/transacoes', autenticar, async (req, res) => {
    const result = await pool.query('SELECT * FROM transacoes WHERE usuario_id = $1 ORDER BY data DESC', [req.usuario.id]);
    res.json(result.rows);
});

app.post('/transacoes', autenticar, async (req, res) => {
    const { descricao, valor, tipo, data } = req.body;
    const result = await pool.query(
        'INSERT INTO transacoes (descricao, valor, tipo, data, usuario_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [descricao, valor, tipo, data, req.usuario.id]
    );
    res.json(result.rows[0]);
});

app.delete('/transacoes/:id', autenticar, async (req, res) => {
    await pool.query('DELETE FROM transacoes WHERE id = $1 AND usuario_id = $2', [req.params.id, req.usuario.id]);
    res.json({ mensagem: 'Deletado!' });
});

app.put('/transacoes/:id', autenticar, async (req, res) => {
    const { descricao, valor, data } = req.body;
    const result = await pool.query('UPDATE transacoes SET descricao = $1, valor = $2, data = $3 WHERE id = $4 AND usuario_id = $5 RETURNING *', [descricao, valor, data, req.params.id, req.usuario.id]);
    res.json(result.rows[0]);
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

const port = process.env.PORT || 4000;

app.listen(port, () => console.log("Servidor do mywallet rodando na porta " + port));
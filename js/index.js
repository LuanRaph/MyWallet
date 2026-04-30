require('dotenv').config();
const express = require("express");
const path = require('path');
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(express.static('.'));

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

app.get('/transacoes', async (req, res) => {
    const result = await pool.query('SELECT * FROM transacoes ORDER BY data DESC');
    res.json(result.rows);
});

app.post('/transacoes', async (req, res) => {
    const { descricao, valor, tipo, data } = req.body;
    const result = await pool.query(
        'INSERT INTO transacoes (descricao, valor, tipo, data) VALUES ($1, $2, $3, $4) RETURNING *', [descricao, valor, tipo, data]
    );
    res.json(result.rows[0]);
});

app.delete('/transacoes/:id', async (req, res) => {
    await pool.query('DELETE FROM transacoes WHERE id = $1', [req.params.id]);
    res.json({ mensagem: 'Deletado!' });
});

app.put('/transacoes/:id', async (req, res) => {
    const { descricao, valor, data } = req.body;
    const result = await pool.query('UPDATE transacoes SET descricao = $1, valor = $2, data = $3 WHERE id = $4 RETURNING *', [descricao, valor, data, req.params.id]);
    res.json(result.rows[0]);
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

const port = process.env.PORT || 4000;

app.listen(port, () => console.log("Servidor do mywallet rodando na porta " + port));
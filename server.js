const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(express.json()); 
app.use(cors()); 

// Configuração do Pool de Conexão
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, 
    port: process.env.DB_PORT
});

// --- ROTA DE CADASTRO ---
app.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body; // 'email' vem do seu formulário HTML
    
    try {
        const hash = await bcrypt.hash(senha, 10);
        
        // Inserindo na tabela seguranca_tbUsuarios usando a coluna 'login' para o email
        const query = 'INSERT INTO seguranca_tbUsuarios (nome, login, senha) VALUES (?, ?, ?)';
        
        db.query(query, [nome, email, hash], (err, result) => {
            if (err) {
                console.error("❌ Erro no MySQL:", err.message);
                return res.status(500).send("Erro no banco: " + err.message);
            }
            console.log(`✅ Usuário ${nome} cadastrado com sucesso!`);
            res.status(201).send("Usuário cadastrado com sucesso!");
        });
    } catch (error) {
        res.status(500).send("Erro interno no servidor.");
    }
});

// --- ROTA DE LOGIN ---
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    // Buscando pela coluna 'login'
    const query = 'SELECT * FROM seguranca_tbUsuarios WHERE login = ?';
    
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error("❌ Erro no MySQL:", err.message);
            return res.status(500).send("Erro no servidor.");
        }
        
        if (results.length === 0) return res.status(401).send("Usuário não encontrado.");

        const user = results[0];
        const match = await bcrypt.compare(senha, user.senha);

        if (match) {
            // Retorna o usuario_id conforme seu banco
            res.json({ 
                message: "Login bem-sucedido!", 
                user: { id: user.usuario_id, nome: user.nome } 
            });
        } else {
            res.status(401).send("Senha incorreta.");
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 Banco: ${process.env.DB_NAME} | Tabela: seguranca_tbUsuarios`);
});
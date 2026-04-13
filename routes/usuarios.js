const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// ROTA: Receber dados do Checkout e cadastrar o usuário (POST /usuarios/cadastrar)
router.post('/cadastrar', async (req, res) => {
    try {
        // Pega os dados que vieram do formulário (incluindo o input hidden do 'plano')
        const { nome, email, senha, plano } = req.body;

        // Cria o usuário no banco de dados (o bcrypt vai criptografar a senha automaticamente!)
        await Usuario.create({ nome, email, senha, plano });
        
        console.log(`Novo usuário SaaS cadastrado: ${nome} - Plano: ${plano}`);
        
        // Após o cadastro/pagamento com sucesso, manda ele para a tela de Login
        res.redirect('/login');
        
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        res.status(400).send('Erro ao criar sua conta. Talvez este e-mail já esteja em uso.');
    }
});

module.exports = router;
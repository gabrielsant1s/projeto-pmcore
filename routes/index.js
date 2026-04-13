const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Importa a biblioteca de criptografia
const Usuario = require('../models/Usuario'); // Importa o modelo do banco
const Cliente = require('../models/Cliente');

// --- ROTAS GET (As que apenas mostram as telas) ---

router.get('/', (req, res) => {
    res.render('landingpage'); 
});

router.get('/login', (req, res) => {
    res.render('login');
    // Dentro do router.post('/login'...)
    req.session.usuario = {
    id: usuarioEncontrado._id,
    nome: usuarioEncontrado.nome
  };
    if(erro) { return res.send("erro"); } // Correto! O código para aqui.
    res.render("sucesso");
});

router.get('/configuracoes', (req, res) => {
    // Se não houver usuário na sessão, manda para o login
    if (!req.session.usuario) {
        return res.redirect('/login');
    }

    // Passamos o usuário real da sessão para a tela
    res.render('configuracoes', { usuario: req.session.usuario });
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/login');
    });
});

router.get('/checkout/:plano', (req, res) => {
    res.render('checkout', { plano: req.params.plano });
});

router.get('/dashboard', (req, res, next) => {
    if (!req.session.usuario) return res.redirect('/login');
    next();
}, async (req, res) => {
    try {
        const clientes = await Cliente.find({ usuario: req.session.usuario.id }); // Busca apenas os clientes do usuário logado
        const totalClientes = clientes.length;

        // Renderiza passando tanto o total quanto a lista
        res.render('dashboard', { totalClientes, clientes });
    } catch (error) {
        res.status(500).send("Erro ao carregar dashboard.");
    }
}); 

router.get('/perfil', (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
    // Agora o 'usuario' aqui vem da sessão que acabamos de corrigir no login
    res.render('perfil', { usuario: req.session.usuario });
});

// --- ROTA POST (Processar o Login) ---

router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // 1. O nome da variável DEVE ser usuarioEncontrado
        const usuarioEncontrado = await Usuario.findOne({ email });

        if (!usuarioEncontrado) {
            console.log("Usuário não encontrado no banco.");
            return res.status(400).send('E-mail ou senha incorretos.');
        }

        // 2. Comparar a senha usando a variável correta
        const senhaValida = await bcrypt.compare(senha, usuarioEncontrado.senha);
        
        if (!senhaValida) {
            console.log("Senha inválida para o usuário.");
            return res.status(400).send('E-mail ou senha incorretos.');
        }

        // 3. Salvar na sessão (Aqui é onde o erro costuma dar se o nome estiver errado)
        req.session.usuario = {
            id: usuarioEncontrado._id,
            nome: usuarioEncontrado.nome,
            email: usuarioEncontrado.email
        };

        console.log(`Login realizado: ${usuarioEncontrado.nome}`);
        
        // Sempre use return no redirect para evitar erro de Header
        return res.redirect('/dashboard');

    } catch (error) {
        console.error("Erro interno no login:", error);
        return res.status(500).send('Erro no servidor.');
    }
});

module.exports = router;
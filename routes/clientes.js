const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// Middleware para verificar se o usuário está logado
router.use((req, res, next) => {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
    next();
});

// 1. ROTA: Abrir o formulário de Novo Cliente (/clientes/novo)
// (Nota: Esta rota sempre deve ficar no topo para o Express não se confundir)
router.get('/novo', (req, res) => {
    res.render('novocliente');
});

// 2. ROTA: Listar Clientes (/clientes)
router.get('/', async (req, res) => {
    const clientes = await Cliente.find({ usuario: req.session.usuario.id });
    res.render('clientes', { clientes });
});

// 3. ROTA: Receber os dados do formulário e Salvar no Banco (POST /clientes)
router.post('/', async (req, res) => {
    const novoCliente = { ...req.body, usuario: req.session.usuario.id };
    await Cliente.create(novoCliente);
    res.redirect('/clientes');
});

// 4. ROTA: Ver detalhes de um cliente específico (GET /clientes/:id)
router.get('/:id', async (req, res) => {
    try {
        // Busca no MongoDB o cliente que tem exatamente este ID
        const cliente = await Cliente.findById(req.params.id);
        
        if (!cliente) {
            return res.status(404).send('Cliente não encontrado.');
        }

        // Renderiza a tela de detalhes passando os dados do cliente encontrado
        res.render('detalhes-cliente', { cliente });
    } catch (error) {
        console.error("Erro ao buscar detalhes do cliente:", error);
        res.status(500).send("Erro interno ao buscar cliente.");
    }
});

// 5. ROTA: Excluir um cliente (POST /clientes/:id/excluir)
router.post('/:id/excluir', async (req, res) => {
    try {
        // Encontra o cliente pelo ID e o deleta do MongoDB
        await Cliente.findByIdAndDelete(req.params.id);
        
        console.log('Cliente excluído com sucesso do banco de dados!');
        
        // Redireciona de volta para a lista de clientes
        res.redirect('/clientes');
    } catch (error) {
        console.error("Erro ao excluir cliente:", error);
        res.status(500).send("Erro interno ao tentar excluir o cliente.");
    }
});

// 6. ROTA: Abrir a tela de edição com os dados preenchidos (GET /clientes/:id/editar)
router.get('/:id/editar', async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(404).send('Cliente não encontrado.');
        }
        // Manda o cliente encontrado para a tela de edição
        res.render('editar-cliente', { cliente });
    } catch (error) {
        console.error("Erro ao abrir edição:", error);
        res.status(500).send("Erro interno ao buscar cliente para edição.");
    }
});

// 7. ROTA: Receber os dados alterados e salvar no banco (POST /clientes/:id/atualizar)
router.post('/:id/atualizar', async (req, res) => {
    try {
        // Encontra o cliente pelo ID e substitui pelos novos dados que vieram do formulário (req.body)
        await Cliente.findByIdAndUpdate(req.params.id, req.body);
        
        console.log('Cliente atualizado com sucesso no MongoDB!');
        
        // Redireciona de volta para a tela de detalhes daquele cliente para ver como ficou
        res.redirect(`/clientes/${req.params.id}`);
    } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        res.status(400).send('Erro ao atualizar os dados do cliente.');
    }
});

module.exports = router;
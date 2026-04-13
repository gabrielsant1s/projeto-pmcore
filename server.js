require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Importação limpa, sem o (session)

const app = express();
const path = require('path');

// Conectando ao Banco de Dados
const connectDB = require('./config/db');
connectDB();

// Configurações do Express
app.use(express.json()); // Para aceitar JSON
app.use(express.urlencoded({ extended: true })); // Para aceitar dados de formulários

// Configuração da Sessão
app.use(session({
    secret: 'chave-secreta-do-pmcore-123', 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: 'mongodb+srv://admincrm:crm123@users.7ea2epl.mongodb.net/?appName=Users' 
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 dia
}));

// Configuração do EJS como View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Arquivos estáticos (CSS, JS do Front, Imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Importando Rotas
const indexRoutes = require('./routes/index');
const clientesRoutes = require('./routes/clientes');
const usuariosRoutes = require('./routes/usuarios'); 

// Usando as Rotas
app.use('/', indexRoutes);
app.use('/clientes', clientesRoutes);
app.use('/usuarios', usuariosRoutes);
app.use((req, res) => {
    if (!res.headersSent) {
        res.status(404).render('404');
    }
});

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor do CRM rodando na porta ${PORT}`);
});

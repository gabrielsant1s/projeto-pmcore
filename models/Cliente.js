const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome do cliente é obrigatório'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'O e-mail é obrigatório'],
        unique: true,
        lowercase: true
    },
    telefone: {
        type: String
    },
    status: {
        type: String,
        enum: ['Prospecção', 'Negociação', 'Fechado'], // Só aceita esses 3 valores
        default: 'Prospecção'
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId, // Salva o ID único do usuário
        ref: 'Usuario',                       // Faz referência à coleção de Usuários
        required: true                        // Todo cliente TEM que ter um dono agora
    },
    criadoEm: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cliente', ClienteSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome é obrigatório'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'O e-mail é obrigatório'],
        unique: true,
        lowercase: true
    },
    senha: {
        type: String,
        required: [true, 'A senha é obrigatória']
    },
    plano: {
        type: String,
        enum: ['basico', 'pro', 'enterprise'], // Só aceita esses três valores
        default: 'basico'
    },
    criadoEm: {
        type: Date,
        default: Date.now
    }
});

// MÁGICA DA SEGURANÇA: Antes de salvar (pre-save), criptografe a senha!
UsuarioSchema.pre('save', async function() {
    // Se a senha não foi modificada/criada agora, ignora
    if (!this.isModified('senha')) return;
    
    // Gera um "sal" (código aleatório) e mistura com a senha
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
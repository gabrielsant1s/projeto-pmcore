const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Erro na conexão com o MongoDB: ${error.message}`);
        process.exit(1); // Para a aplicação caso o banco não conecte
    }
};

module.exports = connectDB;
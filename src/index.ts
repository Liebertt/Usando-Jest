import express from "express";
import dotenv from "dotenv";
import { Database } from "@infrastructure/config/Database"; // Ajustado caminho relativo

dotenv.config();

async function startApp() {
    // Inicializa o banco de dados (SQLite neste caso)
    Database.init(); 
    // Não há necessidade de 'await' aqui para SQLite na implementação atual, 
    // mas mantemos a estrutura async para consistência ou futuras mudanças.
    console.log("Tentando inicializar o banco de dados..."); // Log adicionado

    const app = express();
    app.use(express.json());

    // Importa e usa as rotas de usuário
    const userRoutes = await import("./presentation/routes/userRoutes"); // Ajustado caminho relativo
    app.use("/api", userRoutes.default);

    // Importa e usa as rotas de contato
    const contatoRoutes = await import("./presentation/routes/contatoRoutes"); // Ajustado caminho relativo
    app.use("/api", contatoRoutes.default);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Aplicação rodando na porta ${PORT}`));

    // Graceful shutdown (opcional mas recomendado)
    process.on('SIGINT', () => {
        console.log('\nRecebido SIGINT. Fechando conexão com o banco de dados...');
        Database.close();
        process.exit(0);
    });
}

startApp().catch(error => {
    console.error("Erro ao iniciar a aplicação:", error);
    Database.close(); // Tenta fechar o DB mesmo em caso de erro na inicialização
    process.exit(1);
});


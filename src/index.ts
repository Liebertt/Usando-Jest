import express from "express";
import dotenv from "dotenv";
import { Database } from "@infrastructure/config/Database";

dotenv.config();

async function startApp() {
    try {
        console.log("Tentando inicializar o banco de dados...");
        
        // Aguarda a inicialização do banco de dados
        await Database.init();
        console.log("Banco de dados inicializado com sucesso!");

        const app = express();
        app.use(express.json());

        // Importa as rotas APÓS a inicialização do banco
        const { default: userRoutes } = await import("./presentation/routes/userRoutes");
        app.use("/api", userRoutes);

        const { default: contatoRoutes } = await import("./presentation/routes/contatoRoutes");
        app.use("/api", contatoRoutes);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Aplicação rodando na porta ${PORT}`);
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            console.log('\nRecebido SIGINT. Fechando conexão com o banco de dados...');
            await Database.close();
            process.exit(0);
        });

    } catch (error) {
        console.error("Erro ao iniciar a aplicação:", error);
        await Database.close();
        process.exit(1);
    }
}

startApp();
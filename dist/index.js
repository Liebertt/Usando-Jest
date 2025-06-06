"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const Database_1 = require("@infrastructure/config/Database"); // Ajustado caminho relativo
dotenv_1.default.config();
function startApp() {
    return __awaiter(this, void 0, void 0, function* () {
        // Inicializa o banco de dados (SQLite neste caso)
        Database_1.Database.init();
        // Não há necessidade de 'await' aqui para SQLite na implementação atual, 
        // mas mantemos a estrutura async para consistência ou futuras mudanças.
        console.log("Tentando inicializar o banco de dados..."); // Log adicionado
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        // Importa e usa as rotas de usuário
        const userRoutes = yield Promise.resolve().then(() => __importStar(require("./presentation/routes/userRoutes"))); // Ajustado caminho relativo
        app.use("/api", userRoutes.default);
        // Importa e usa as rotas de contato
        const contatoRoutes = yield Promise.resolve().then(() => __importStar(require("./presentation/routes/contatoRoutes"))); // Ajustado caminho relativo
        app.use("/api", contatoRoutes.default);
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Aplicação rodando na porta ${PORT}`));
        // Graceful shutdown (opcional mas recomendado)
        process.on('SIGINT', () => {
            console.log('\nRecebido SIGINT. Fechando conexão com o banco de dados...');
            Database_1.Database.close();
            process.exit(0);
        });
    });
}
startApp().catch(error => {
    console.error("Erro ao iniciar a aplicação:", error);
    Database_1.Database.close(); // Tenta fechar o DB mesmo em caso de erro na inicialização
    process.exit(1);
});

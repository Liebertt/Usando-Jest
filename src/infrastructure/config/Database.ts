import sqlite3 from "sqlite3";
import path from "path";

export class Database {
    private static db: sqlite3.Database | null = null;
    private static dbPath = path.resolve(__dirname, "../../../agenda.db"); // Caminho para o arquivo do banco de dados na raiz do projeto

    public static init() {
        if (!this.db) {
            // Usar verbose() para obter mais informações de depuração, se necessário
            const verboseSqlite3 = sqlite3.verbose();
            // Armazena a instância recém-criada em uma variável local
            const newDbInstance = new verboseSqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error("Erro ao conectar ao banco de dados SQLite:", err.message);
                    this.db = null; // Garante que db permaneça null em caso de erro
                    throw err; // Lança o erro para interromper a inicialização se a conexão falhar
                } else {
                    console.log("Conectado ao banco de dados SQLite 'agenda.db'");
                    // Habilitar chaves estrangeiras (importante para a relação Usuario-Contato)
                    // Verifica se a instância do DB (newDbInstance) foi criada com sucesso antes de usar
                    if (newDbInstance) {
                        newDbInstance.run("PRAGMA foreign_keys = ON;", (pragmaErr) => {
                            if (pragmaErr) {
                                console.error("Erro ao habilitar chaves estrangeiras:", pragmaErr.message);
                                // Considerar fechar a conexão ou lançar erro se PRAGMA falhar?
                            }
                        });
                    } else {
                        // Isso não deveria acontecer se a conexão foi bem-sucedida, mas é uma segurança extra
                        console.error("Erro crítico: Instância do DB é nula após conexão bem-sucedida.");
                    }
                }
            });
            // Atribui a instância à variável estática APÓS a configuração inicial (ou tentativa)
            this.db = newDbInstance;
        }
    }

    public static getConnection(){
        if (!this.db) {
            // Tenta inicializar se ainda não foi feito (embora deva ser chamado explicitamente no início da aplicação)
            this.init();
            if (!this.db) { // Verifica novamente após a tentativa de inicialização
                 throw new Error("Banco de dados SQLite não iniciado. Execute o init() primeiro.");
            }
        }
        return this.db;
    }

    // Método para fechar a conexão (útil para graceful shutdown)
    public static close() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error("Erro ao fechar a conexão SQLite:", err.message);
                } else {
                    console.log("Conexão SQLite fechada.");
                    this.db = null;
                }
            });
        }
    }
}


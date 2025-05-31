// infrastructure/config/Database.ts (ou o caminho que você estiver usando)
import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

export class Database {
    private static db: sqlite3.Database | null = null;
    // Ajuste este caminho para apontar para a raiz do seu projeto após a compilação
    private static dbPath = path.resolve(process.cwd(), "agenda.db");
    // Ajuste este caminho para apontar para o seu dataBase.sql na raiz do projeto
    private static sqlScriptPath = path.resolve(process.cwd(), "dataBase.sql");

    public static init(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.db) {
                console.log("Banco de dados já inicializado.");
                resolve();
                return;
            }

            console.log("Tentando inicializar o banco de dados...");
            const verboseSqlite3 = sqlite3.verbose();
            // Atribui a this.db aqui para que possa ser usado nos callbacks
            const newDbInstance = new verboseSqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error(`Erro ao conectar ao banco de dados SQLite (${this.dbPath}):`, err.message);
                    this.db = null;
                    reject(err);
                } else {
                    this.db = newDbInstance; // Conexão estabelecida, atribui à propriedade estática
                    console.log(`Conectado ao banco de dados SQLite '${this.dbPath}'`);

                    this.db.run("PRAGMA foreign_keys = ON;", (pragmaErr) => {
                        if (pragmaErr) {
                            console.error("Erro ao habilitar chaves estrangeiras:", pragmaErr.message);
                            // Você pode decidir rejeitar a promise aqui se for crítico
                            // reject(pragmaErr);
                            // return;
                        } else {
                            console.log("Chaves estrangeiras habilitadas.");
                        }
                        // Continua para inicializar o schema mesmo se o pragma tiver um erro não crítico
                        this.initializeSchemaWithPromise().then(resolve).catch(reject);
                    });
                }
            });
        });
    }

    private static initializeSchemaWithPromise(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                // Esta verificação é mais uma segurança, o fluxo normal não deveria chegar aqui sem this.db
                reject(new Error("Tentativa de inicializar schema sem conexão estabelecida com o DB."));
                return;
            }

            const dbInstance = this.db;
            let sqlScript: string;
            try {
                console.log(`Tentando ler script SQL de: ${this.sqlScriptPath}`);
                sqlScript = fs.readFileSync(this.sqlScriptPath).toString();
                 // Lembre-se: dataBase.sql deve conter apenas CREATE TABLE IF NOT EXISTS User (...)
            } catch (readErr: any) {
                console.error(`Erro ao ler o arquivo SQL (${this.sqlScriptPath}):`, readErr.message);
                reject(new Error(`Falha ao ler script SQL: ${readErr.message}`));
                return;
            }

            dbInstance.get("SELECT name FROM sqlite_master WHERE type='table' AND name='User'", (err, row) => {
                if (err) {
                    console.error("Erro ao verificar a existência da tabela User:", err.message);
                    reject(err);
                    return;
                }

                if (!row) {
                    console.log("Tabela 'User' não encontrada. Executando script de criação...");
                    dbInstance.exec(sqlScript, (execErr) => {
                        if (execErr) {
                            console.error("Erro ao executar script SQL para criar tabelas:", execErr.message);
                            reject(execErr);
                        } else {
                            console.log("Script SQL executado com sucesso. Tabelas criadas/verificadas.");
                            resolve();
                        }
                    });
                } else {
                    console.log("Tabela 'User' já existe.");
                    resolve();
                }
            });
        });
    }

    public static getConnection(): sqlite3.Database {
        if (!this.db) {
            throw new Error("Banco de dados SQLite não iniciado. O método init() deve ser chamado e aguardado no início da aplicação.");
        }
        return this.db;
    }

    public static close(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        console.error("Erro ao fechar a conexão SQLite:", err.message);
                        reject(err);
                    } else {
                        console.log("Conexão SQLite fechada.");
                        this.db = null;
                        resolve();
                    }
                });
            } else {
                resolve(); // Nenhuma conexão para fechar
            }
        });
    }
}
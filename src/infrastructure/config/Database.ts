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
            
            // Remove o arquivo existente se estiver corrompido
            if (fs.existsSync(this.dbPath)) {
                try {
                    // Tenta verificar se o arquivo é um banco válido
                    const stats = fs.statSync(this.dbPath);
                    if (stats.size === 0) {
                        console.log("Arquivo de banco vazio detectado, removendo...");
                        fs.unlinkSync(this.dbPath);
                    }
                } catch (error) {
                    console.log("Erro ao verificar arquivo de banco, removendo...", error);
                    fs.unlinkSync(this.dbPath);
                }
            }

            const verboseSqlite3 = sqlite3.verbose();
            const newDbInstance = new verboseSqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error(`Erro ao conectar ao banco de dados SQLite (${this.dbPath}):`, err.message);
                    this.db = null;
                    reject(err);
                } else {
                    this.db = newDbInstance;
                    console.log(`Conectado ao banco de dados SQLite '${this.dbPath}'`);

                    this.db.run("PRAGMA foreign_keys = ON;", (pragmaErr) => {
                        if (pragmaErr) {
                            console.error("Erro ao habilitar chaves estrangeiras:", pragmaErr.message);
                        } else {
                            console.log("Chaves estrangeiras habilitadas.");
                        }
                        // Continua para inicializar o schema
                        this.initializeSchemaWithPromise().then(resolve).catch(reject);
                    });
                }
            });
        });
    }

    private static initializeSchemaWithPromise(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Tentativa de inicializar schema sem conexão estabelecida com o DB."));
                return;
            }

            const dbInstance = this.db;
            let sqlScript: string;
            
            try {
                console.log(`Tentando ler script SQL de: ${this.sqlScriptPath}`);
                sqlScript = fs.readFileSync(this.sqlScriptPath, 'utf8');
            } catch (readErr: any) {
                console.error(`Erro ao ler o arquivo SQL (${this.sqlScriptPath}):`, readErr.message);
                reject(new Error(`Falha ao ler script SQL: ${readErr.message}`));
                return;
            }

            // Verifica se as tabelas já existem
            dbInstance.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Usuario'", (err, row) => {
                if (err) {
                    console.error("Erro ao verificar a existência da tabela Usuario:", err.message);
                    reject(err);
                    return;
                }

                if (!row) {
                    console.log("Tabela 'Usuario' não encontrada. Executando script de criação...");
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
                    console.log("Tabela 'Usuario' já existe.");
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
                resolve();
            }
        });
    }
}
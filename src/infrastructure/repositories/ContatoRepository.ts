/**
 * @author Lieberte Ferreira <liebertt7@gmail.com>
 * @date 2025-05-10
 * Implementação concreta do repositório de Contatos para interagir com o banco de dados SQLite.
 */
import { IContatoRepository } from "@domain/repositories/IContatoRepository";
import { Contato } from "@domain/entities/Contato";
import { Database } from "@infrastructure/config/Database";
import { plainToInstance } from "class-transformer";
import sqlite3 from "sqlite3";

export class ContatoRepository implements IContatoRepository {
    private db: sqlite3.Database;

    constructor() {
        this.db = Database.getConnection();
    }

    save(contato: Contato): Promise<Contato> {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO Contato 
                         (Id_usuario, Telefone_celular, Telefone_recado, Email, Endereco) 
                         VALUES (?, ?, ?, ?, ?)`;
            this.db.run(sql, 
                [contato.Id_usuario, contato.Telefone_celular, contato.Telefone_recado, contato.Email, contato.Endereco],
                function(err) { // Use function() for correct `this` context
                    if (err) {
                        console.error(`Erro ao salvar contato (${contato.Email}) no bd: ${err.message}`);
                        // Specific check for UNIQUE constraint violation on Email
                        if (err.message.includes("UNIQUE constraint failed: Contato.Email")) {
                            reject(new Error(`Erro: O email '${contato.Email}' já está cadastrado para outro contato.`));
                        } else {
                            reject(new Error(`Erro ao salvar contato no bd: ${err.message}`));
                        }
                    } else {
                        contato.Id = this.lastID; // Get the ID of the inserted row
                        resolve(contato);
                    }
                });
        });
    }

    findByUserId(userId: number): Promise<Contato[] | null> {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Contato WHERE Id_usuario = ?";
            this.db.all(sql, [userId], (err, rows) => {
                if (err) {
                    console.error(`Erro ao buscar contatos para o usuário (ID: ${userId}) no bd: ${err.message}`);
                    reject(new Error(`Erro ao buscar contatos no bd: ${err.message}`));
                } else {
                    // plainToInstance can handle arrays directly
                    resolve(plainToInstance(Contato, rows as object[]));
                }
            });
        });
    }

    findByEmail(email: string): Promise<Contato | null> {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Contato WHERE Email = ?";
            this.db.get(sql, [email], (err, row) => {
                if (err) {
                    console.error(`Erro ao buscar contato por email (${email}) no bd: ${err.message}`);
                    reject(new Error(`Erro ao buscar contato por email no bd: ${err.message}`));
                } else {
                    resolve(plainToInstance(Contato, row as object));
                }
            });
        });
    }

    findByName(name: string): Promise<Contato[] | null> {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Contato WHERE Nome LIKE ?";
            this.db.all(sql, [`%${name}%`], (err, rows) => {
                if (err) {
                    console.error(`Erro ao buscar contatos por nome (${name}) no bd: ${err.message}`);
                    reject(new Error(`Erro ao buscar contatos por nome no bd: ${err.message}`));
                } else {
                    resolve(plainToInstance(Contato, rows as object[]));
                }
            });
        });
    }

    // Implement other methods from IContatoRepository if they were added
    // findById(id: number): Promise<Contato | null> { ... }
    // update(contato: Contato): Promise<Contato | null> { ... }
}


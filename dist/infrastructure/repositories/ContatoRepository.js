"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContatoRepository = void 0;
const Contato_1 = require("@domain/entities/Contato");
const Database_1 = require("@infrastructure/config/Database");
const class_transformer_1 = require("class-transformer");
class ContatoRepository {
    constructor() {
        this.db = Database_1.Database.getConnection();
    }
    save(contato) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO Contato 
                         (Id_usuario, Telefone_celular, Telefone_recado, Email, Endereco) 
                         VALUES (?, ?, ?, ?, ?)`;
            this.db.run(sql, [contato.Id_usuario, contato.Telefone_celular, contato.Telefone_recado, contato.Email, contato.Endereco], function (err) {
                if (err) {
                    console.error(`Erro ao salvar contato (${contato.Email}) no bd: ${err.message}`);
                    // Specific check for UNIQUE constraint violation on Email
                    if (err.message.includes("UNIQUE constraint failed: Contato.Email")) {
                        reject(new Error(`Erro: O email '${contato.Email}' já está cadastrado para outro contato.`));
                    }
                    else {
                        reject(new Error(`Erro ao salvar contato no bd: ${err.message}`));
                    }
                }
                else {
                    contato.Id = this.lastID; // Get the ID of the inserted row
                    resolve(contato);
                }
            });
        });
    }
    findByUserId(userId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Contato WHERE Id_usuario = ?";
            this.db.all(sql, [userId], (err, rows) => {
                if (err) {
                    console.error(`Erro ao buscar contatos para o usuário (ID: ${userId}) no bd: ${err.message}`);
                    reject(new Error(`Erro ao buscar contatos no bd: ${err.message}`));
                }
                else {
                    // plainToInstance can handle arrays directly
                    resolve((0, class_transformer_1.plainToInstance)(Contato_1.Contato, rows));
                }
            });
        });
    }
    findByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Contato WHERE Email = ?";
            this.db.get(sql, [email], (err, row) => {
                if (err) {
                    console.error(`Erro ao buscar contato por email (${email}) no bd: ${err.message}`);
                    reject(new Error(`Erro ao buscar contato por email no bd: ${err.message}`));
                }
                else {
                    resolve((0, class_transformer_1.plainToInstance)(Contato_1.Contato, row));
                }
            });
        });
    }
    findByName(name) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Contato WHERE Nome LIKE ?";
            this.db.all(sql, [`%${name}%`], (err, rows) => {
                if (err) {
                    console.error(`Erro ao buscar contatos por nome (${name}) no bd: ${err.message}`);
                    reject(new Error(`Erro ao buscar contatos por nome no bd: ${err.message}`));
                }
                else {
                    resolve((0, class_transformer_1.plainToInstance)(Contato_1.Contato, rows));
                }
            });
        });
    }
}
exports.ContatoRepository = ContatoRepository;

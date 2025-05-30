"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = require("@domain/entities/User");
const Database_1 = require("@infrastructure/config/Database"); // Corrigido o caminho relativo
const UserDTO_1 = require("@presentation/dtos/UserDTO");
const class_transformer_1 = require("class-transformer");
class UserRepository {
    constructor() {
        // Garante que a conexão seja obtida ao instanciar o repositório
        this.db = Database_1.Database.getConnection();
    }
    findAll() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM Usuario", [], (err, rows) => {
                if (err) {
                    console.error(`Erro ao recuperar registros no bd: ${err.message}`);
                    reject(new Error(`Erro ao recuperar registros no bd: ${err.message}`));
                }
                else {
                    // SQLite retorna um array de objetos diretamente
                    resolve((0, class_transformer_1.plainToInstance)(UserDTO_1.UserDTO, rows));
                }
            });
        });
    }
    save(user) {
        return new Promise((resolve, reject) => {
            // A função `run` do sqlite3 usa uma função de callback
            // O `this` dentro do callback se refere ao statement
            const sql = "INSERT INTO Usuario (name, email) VALUES (?, ?)";
            this.db.run(sql, [user.name, user.email], function (err) {
                if (err) {
                    console.error(`Erro ao persistir o registro (${user.email}) no bd: ${err.message}`);
                    reject(new Error(`Erro ao persistir o registro (${user.email}) no bd: ${err.message}`));
                }
                else {
                    // `this.lastID` contém o ID do último registro inserido
                    user.id = this.lastID;
                    resolve(user);
                }
            });
        });
    }
    findByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Usuario WHERE email = ?";
            // `get` retorna a primeira linha encontrada ou undefined
            this.db.get(sql, [email], (err, row) => {
                if (err) {
                    console.error(`Erro ao recuperar registro (${email}) no bd: ${err.message}`);
                    reject(new Error(`Erro ao recuperar registro (${email}) no bd: ${err.message}`));
                }
                else {
                    // Se `row` for undefined, retorna null, caso contrário, retorna o usuário
                    resolve(row ? (0, class_transformer_1.plainToInstance)(User_1.User, row) : null);
                }
            });
        });
    }
    findById(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Usuario WHERE id = ?";
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    console.error(`Erro ao recuperar registro (ID: ${id}) no bd: ${err.message}`);
                    reject(new Error(`Erro ao recuperar registro (ID: ${id}) no bd: ${err.message}`));
                }
                else {
                    resolve(row ? (0, class_transformer_1.plainToInstance)(User_1.User, row) : null);
                }
            });
        });
    }
}
exports.UserRepository = UserRepository;

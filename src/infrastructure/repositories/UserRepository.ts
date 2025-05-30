import { IUserRepository } from "@domain/repositories/IUserRepository";
import { User } from "@domain/entities/User";
import { Database } from "@infrastructure/config/Database"; // Corrigido o caminho relativo
import { UserDTO } from "@presentation/dtos/UserDTO";
import { plainToInstance } from "class-transformer";
import sqlite3 from "sqlite3";

export class UserRepository implements IUserRepository {
    private db: sqlite3.Database;

    constructor() {
        // Garante que a conexão seja obtida ao instanciar o repositório
        this.db = Database.getConnection();
    }

    findAll(): Promise<UserDTO[] | null> {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM Usuario", [], (err, rows) => {
                if (err) {
                    console.error(`Erro ao recuperar registros no bd: ${err.message}`);
                    reject(new Error(`Erro ao recuperar registros no bd: ${err.message}`));
                } else {
                    // SQLite retorna um array de objetos diretamente
                    resolve(plainToInstance(UserDTO, rows));
                }
            });
        });
    }

    save(user: User): Promise<User> {
        return new Promise((resolve, reject) => {
            // A função `run` do sqlite3 usa uma função de callback
            // O `this` dentro do callback se refere ao statement
            const sql = "INSERT INTO Usuario (name, email) VALUES (?, ?)";
            this.db.run(sql, [user.name, user.email], function(err) { // Usar function() para ter acesso ao `this` correto
                if (err) {
                    console.error(`Erro ao persistir o registro (${user.email}) no bd: ${err.message}`);
                    reject(new Error(`Erro ao persistir o registro (${user.email}) no bd: ${err.message}`));
                } else {
                    // `this.lastID` contém o ID do último registro inserido
                    user.id = this.lastID;
                    resolve(user);
                }
            });
        });
    }

    findByEmail(email: string): Promise<User | null> {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Usuario WHERE email = ?";
            // `get` retorna a primeira linha encontrada ou undefined
            this.db.get(sql, [email], (err, row) => {
                if (err) {
                    console.error(`Erro ao recuperar registro (${email}) no bd: ${err.message}`);
                    reject(new Error(`Erro ao recuperar registro (${email}) no bd: ${err.message}`));
                } else {
                    // Se `row` for undefined, retorna null, caso contrário, retorna o usuário
                    resolve(row ? plainToInstance(User, row as object) : null);
                }
            });
        });
    }

    findById(id: number): Promise<User | null> {
         return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Usuario WHERE id = ?";
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    console.error(`Erro ao recuperar registro (ID: ${id}) no bd: ${err.message}`);
                    reject(new Error(`Erro ao recuperar registro (ID: ${id}) no bd: ${err.message}`));
                } else {
                    resolve(row ? plainToInstance(User, row as object) : null);
                }
            });
        });
    }
}


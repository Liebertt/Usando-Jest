/**
 * @author Lieberte Ferreira <liebertt7@gmail.com>
 * @date 2025-05-10
 * Define a entidade Contato e sua estrutura.
 */
import { User } from "./User"; // Assuming User entity might be referenced

export class Contato {
    Id?: number;
    Id_usuario: number; // Foreign Key referencing User
    Telefone_celular: string;
    Telefone_recado?: string | null; // Nullable
    Email: string; // Unique
    Endereco: string;

    // User object can be optionally loaded/included if needed for domain logic
    usuario?: User;

    constructor(
        _Id_usuario: number,
        _Telefone_celular: string,
        _Email: string,
        _Endereco: string,
        _Telefone_recado?: string | null,
        _Id?: number
    ) {
        this.Id = _Id;
        this.Id_usuario = _Id_usuario;
        this.Telefone_celular = _Telefone_celular;
        this.Email = _Email;
        this.Endereco = _Endereco;
        this.Telefone_recado = _Telefone_recado;
    }
}


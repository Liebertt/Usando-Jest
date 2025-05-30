/**
 * @author Lieberte Ferreira <liebertt7@gmail.com>
 * @date 2025-05-10
 * Define a interface para o repositório de Contatos, especificando os métodos CRUD básicos.
 */
import { Contato } from "../entities/Contato";

export interface IContatoRepository {
    save(contato: Contato): Promise<Contato>;
    findByUserId(userId: number): Promise<Contato[] | null>;
    findByEmail(email: string): Promise<Contato | null>; // Adicionado para validação de email único
    // Poderíamos adicionar outros métodos conforme necessário, como:
    // findById(id: number): Promise<Contato | null>;
    // update(contato: Contato): Promise<Contato | null>;
    // delete(id: number): Promise<boolean>;
}


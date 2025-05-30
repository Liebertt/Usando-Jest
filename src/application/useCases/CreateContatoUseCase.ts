/**
 * @author Lieberte Ferreira <liebertt7@gmail.com>
 * @date 2025-05-10
 * Contém a lógica de negócios para criar um novo contato.
 */
import { Contato } from "@domain/entities/Contato";
import { IContatoRepository } from "@domain/repositories/IContatoRepository";

export class CreateContatoUseCase {
    constructor(private contatoRepository: IContatoRepository) {}

    async execute(contato: Contato): Promise<Contato> {
        try {
            // Validações de domínio poderiam ser adicionadas aqui
            // Por exemplo, verificar se o telefone tem o formato correto, etc.
            
            // Salvar o contato no repositório
            const savedContato = await this.contatoRepository.save(contato);
            return savedContato;
        } catch (error) {
            console.error(`Erro ao criar contato: ${error}`);
            throw error;
        }
    }
}


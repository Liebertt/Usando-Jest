/**
 * @author Lieberte Ferreira <liebertt7@gmail.com>
 * @date 2025-05-10
 * Contém a lógica de negócios para buscar contatos por ID de usuário.
 */
import { Contato } from "@domain/entities/Contato";
import { IContatoRepository } from "@domain/repositories/IContatoRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository"; // Import User repository if needed for validation

export class GetContatosByUserIdUseCase {
    constructor(
        private contatoRepository: IContatoRepository,
        // Optionally inject UserRepository if you need to validate the user ID exists
        // private userRepository: IUserRepository 
    ) {}

    async execute(userId: number): Promise<Contato[] | null> {
        try {
            // Optional: Validate if the user ID exists before fetching contacts
            // const userExists = await this.userRepository.findById(userId);
            // if (!userExists) {
            //     throw new Error(`Usuário com ID ${userId} não encontrado.`);
            // }

            // Buscar contatos pelo ID do usuário no repositório
            const contatos = await this.contatoRepository.findByUserId(userId);
            return contatos;
        } catch (error) {
            console.error(`Erro ao buscar contatos para o usuário ${userId}: ${error}`);
            // Rethrow or handle error as appropriate for the application
            throw error; 
        }
    }
}


/**
 * @author Lieberte Ferreira <liebertt7@gmail.com>
 * @date 2025-05-10
 * Gerencia as requisições HTTP para as operações de Contato.
 */
import { Request, Response } from "express";
import { Contato } from "@domain/entities/Contato";
import { CreateContatoUseCase } from "@application/useCases/CreateContatoUseCase";
import { GetContatosByUserIdUseCase } from "@application/useCases/GetContatosByUserIdUseCase";
import { ContatoRepository } from "@infrastructure/repositories/ContatoRepository"; 
import { UserRepository } from "@infrastructure/repositories/UserRepository"; // Needed for user validation
import { ContatoDTO } from "@presentation/dtos/ContatoDTO";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

// Instantiate repositories and use cases (Dependency Injection could be used here in a real app)
const contatoRepository = new ContatoRepository();
const userRepository = new UserRepository(); // Needed to check if user exists
const createContatoUseCase = new CreateContatoUseCase(contatoRepository);
const getContatosByUserIdUseCase = new GetContatosByUserIdUseCase(contatoRepository);

export class ContatoController {

    async create(req: Request, res: Response): Promise<Response> {
        const contatoDTO = plainToInstance(ContatoDTO, req.body);

        // Validate DTO
        const errors = await validate(contatoDTO);
        if (errors.length > 0) {
            return res.status(400).json({ errors: errors.map(err => Object.values(err.constraints || {})).flat() });
        }

        try {
            // Check if the user exists before creating the contact
            const userExists = await userRepository.findById(contatoDTO.Id_usuario);
            if (!userExists) {
                return res.status(404).json({ message: `Usuário com ID ${contatoDTO.Id_usuario} não encontrado.` });
            }

            // Create Contato entity from DTO
            const contato = new Contato(
                contatoDTO.Id_usuario,
                contatoDTO.Telefone_celular,
                contatoDTO.Email,
                contatoDTO.Endereco,
                contatoDTO.Telefone_recado
            );

            // Execute use case
            const savedContato = await createContatoUseCase.execute(contato);
            return res.status(201).json(savedContato);

        } catch (error: any) {
            // Handle specific errors like unique email constraint
            if (error.message.includes("UNIQUE constraint failed") || error.message.includes("O email")) {
                 return res.status(409).json({ message: error.message }); // Conflict
            }
            console.error(`Erro no controller ao criar contato: ${error.message}`);
            return res.status(500).json({ message: "Erro interno ao criar contato." });
        }
    }

    async getByUserId(req: Request, res: Response): Promise<Response> {
        const userId = parseInt(req.params.userId, 10);

        if (isNaN(userId)) {
            return res.status(400).json({ message: "ID do usuário inválido." });
        }

        try {
             // Optional: Check if the user exists before fetching contacts (already done in use case if injected)
             // const userExists = await userRepository.findById(userId);
             // if (!userExists) {
             //     return res.status(404).json({ message: `Usuário com ID ${userId} não encontrado.` });
             // }

            // Execute use case
            const contatos = await getContatosByUserIdUseCase.execute(userId);

            if (!contatos || contatos.length === 0) {
                // Retorna 200 com array vazio se o usuário existe mas não tem contatos, 
                // ou se o usuário não existe (o use case pode ou não verificar isso, dependendo da implementação)
                // Para ser mais preciso, o ideal seria o use case lançar um erro se o usuário não existir,
                // e o controller tratar esse erro para retornar 404.
                // No momento, se o usuário não existe, findByUserId retornará null/vazio, resultando em 200 com [] ou 404 aqui.
                // Vamos manter o 404 se não houver contatos, assumindo que o front-end pode querer distinguir.
                return res.status(404).json({ message: `Nenhum contato encontrado para o usuário com ID ${userId}.` });
            }

            return res.status(200).json(contatos);

        } catch (error: any) {
            console.error(`Erro no controller ao buscar contatos: ${error.message}`);
            return res.status(500).json({ message: "Erro interno ao buscar contatos." });
        }
    }
}


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
import { UserRepository } from "@infrastructure/repositories/UserRepository";
import { ContatoDTO } from "@presentation/dtos/ContatoDTO";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export class ContatoController {
    private contatoRepository: ContatoRepository;
    private userRepository: UserRepository;
    private createContatoUseCase: CreateContatoUseCase;
    private getContatosByUserIdUseCase: GetContatosByUserIdUseCase;

    constructor() {
        // Inicializa os repositórios e use cases no constructor
        this.contatoRepository = new ContatoRepository();
        this.userRepository = new UserRepository();
        this.createContatoUseCase = new CreateContatoUseCase(this.contatoRepository);
        this.getContatosByUserIdUseCase = new GetContatosByUserIdUseCase(this.contatoRepository);
    }

    async create(req: Request, res: Response): Promise<Response> {
        const contatoDTO = plainToInstance(ContatoDTO, req.body);

        // Validate DTO
        const errors = await validate(contatoDTO);
        if (errors.length > 0) {
            return res.status(400).json({ errors: errors.map(err => Object.values(err.constraints || {})).flat() });
        }

        try {
            // Check if the user exists before creating the contact
            const userExists = await this.userRepository.findById(contatoDTO.Id_usuario);
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
            const savedContato = await this.createContatoUseCase.execute(contato);
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
            // Execute use case
            const contatos = await this.getContatosByUserIdUseCase.execute(userId);

            if (!contatos || contatos.length === 0) {
                return res.status(404).json({ message: `Nenhum contato encontrado para o usuário com ID ${userId}.` });
            }

            return res.status(200).json(contatos);

        } catch (error: any) {
            console.error(`Erro no controller ao buscar contatos: ${error.message}`);
            return res.status(500).json({ message: "Erro interno ao buscar contatos." });
        }
    }
}
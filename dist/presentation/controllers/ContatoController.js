"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContatoController = void 0;
const Contato_1 = require("@domain/entities/Contato");
const CreateContatoUseCase_1 = require("@application/useCases/CreateContatoUseCase");
const GetContatosByUserIdUseCase_1 = require("@application/useCases/GetContatosByUserIdUseCase");
const ContatoRepository_1 = require("@infrastructure/repositories/ContatoRepository");
const UserRepository_1 = require("@infrastructure/repositories/UserRepository"); // Needed for user validation
const ContatoDTO_1 = require("@presentation/dtos/ContatoDTO");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
// Instantiate repositories and use cases (Dependency Injection could be used here in a real app)
const contatoRepository = new ContatoRepository_1.ContatoRepository();
const userRepository = new UserRepository_1.UserRepository(); // Needed to check if user exists
const createContatoUseCase = new CreateContatoUseCase_1.CreateContatoUseCase(contatoRepository);
const getContatosByUserIdUseCase = new GetContatosByUserIdUseCase_1.GetContatosByUserIdUseCase(contatoRepository);
class ContatoController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const contatoDTO = (0, class_transformer_1.plainToInstance)(ContatoDTO_1.ContatoDTO, req.body);
            // Validate DTO
            const errors = yield (0, class_validator_1.validate)(contatoDTO);
            if (errors.length > 0) {
                return res.status(400).json({ errors: errors.map(err => Object.values(err.constraints || {})).flat() });
            }
            try {
                // Check if the user exists before creating the contact
                const userExists = yield userRepository.findById(contatoDTO.Id_usuario);
                if (!userExists) {
                    return res.status(404).json({ message: `Usuário com ID ${contatoDTO.Id_usuario} não encontrado.` });
                }
                // Create Contato entity from DTO
                const contato = new Contato_1.Contato(contatoDTO.Id_usuario, contatoDTO.Telefone_celular, contatoDTO.Email, contatoDTO.Endereco, contatoDTO.Telefone_recado);
                // Execute use case
                const savedContato = yield createContatoUseCase.execute(contato);
                return res.status(201).json(savedContato);
            }
            catch (error) {
                // Handle specific errors like unique email constraint
                if (error.message.includes("UNIQUE constraint failed") || error.message.includes("O email")) {
                    return res.status(409).json({ message: error.message }); // Conflict
                }
                console.error(`Erro no controller ao criar contato: ${error.message}`);
                return res.status(500).json({ message: "Erro interno ao criar contato." });
            }
        });
    }
    getByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const contatos = yield getContatosByUserIdUseCase.execute(userId);
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
            }
            catch (error) {
                console.error(`Erro no controller ao buscar contatos: ${error.message}`);
                return res.status(500).json({ message: "Erro interno ao buscar contatos." });
            }
        });
    }
}
exports.ContatoController = ContatoController;

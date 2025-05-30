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
exports.UserController = void 0;
const CreateUserUseCase_1 = require("@application/useCases/CreateUserUseCase");
const GetAllUsersUseCase_1 = require("@application/useCases/GetAllUsersUseCase");
// import { GetUserByEmailUseCase } from '@application/useCases/GetUserByEmailUseCase'; // Comentado pois o arquivo não existe
const UserRepository_1 = require("@infrastructure/repositories/UserRepository"); // Corrigido para usar alias
const UserDTO_1 = require("@presentation/dtos/UserDTO");
const class_transformer_1 = require("class-transformer"); // Importar plainToInstance
class UserController {
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
        this.createUserUseCase = new CreateUserUseCase_1.CreateUserUseCase(this.userRepository);
        this.getAllUsersUsecase = new GetAllUsersUseCase_1.GetAllUsersUseCase(this.userRepository);
        // this.getByEmailUsecase = new GetUserByEmailUseCase(userRepository); // Comentado
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email } = req.body;
                // Validação básica (poderia usar class-validator DTO aqui também)
                if (!name || !email) {
                    return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
                }
                const user = yield this.createUserUseCase.execute(name, email);
                return res.status(201).json(user);
            }
            catch (error) {
                // Verifica se o erro é de email duplicado (SQLite)
                if (error.message.includes('UNIQUE constraint failed: Usuario.email')) {
                    return res.status(409).json({ error: `O email '${req.body.email}' já está cadastrado.` });
                }
                return res.status(500).json({ error: `Erro interno ao criar usuário: ${error.message}` });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.getAllUsersUsecase.execute(); // Ajustado tipo para aceitar null
                // Retorna 200 com array vazio se não houver usuários, em vez de 404
                return res.status(200).json(users || []);
            }
            catch (error) {
                return res.status(500).json({ error: `Erro interno ao buscar usuários: ${error.message}` });
            }
        });
    }
    // Método getUserByEmail movido para usar o repositório diretamente, já que o UseCase não existe
    getUserByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.params.email;
                if (!email) {
                    return res.status(400).json({ error: 'Email é obrigatório no parâmetro da rota.' });
                }
                const user = yield this.userRepository.findByEmail(email);
                if (!user) {
                    return res.status(404).json({ message: `Usuário com email '${email}' não encontrado.` });
                }
                // Converte para DTO antes de retornar
                return res.status(200).json((0, class_transformer_1.plainToInstance)(UserDTO_1.UserDTO, user));
            }
            catch (error) {
                return res.status(500).json({ error: `Erro interno ao buscar usuário por email: ${error.message}` });
            }
        });
    }
}
exports.UserController = UserController;

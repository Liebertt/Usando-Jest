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
exports.GetContatosByUserIdUseCase = void 0;
class GetContatosByUserIdUseCase {
    constructor(contatoRepository) {
        this.contatoRepository = contatoRepository;
    }
    execute(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Optional: Validate if the user ID exists before fetching contacts
                // const userExists = await this.userRepository.findById(userId);
                // if (!userExists) {
                //     throw new Error(`Usuário com ID ${userId} não encontrado.`);
                // }
                // Buscar contatos pelo ID do usuário no repositório
                const contatos = yield this.contatoRepository.findByUserId(userId);
                return contatos;
            }
            catch (error) {
                console.error(`Erro ao buscar contatos para o usuário ${userId}: ${error}`);
                // Rethrow or handle error as appropriate for the application
                throw error;
            }
        });
    }
}
exports.GetContatosByUserIdUseCase = GetContatosByUserIdUseCase;

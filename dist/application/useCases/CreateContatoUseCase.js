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
exports.CreateContatoUseCase = void 0;
class CreateContatoUseCase {
    constructor(contatoRepository) {
        this.contatoRepository = contatoRepository;
    }
    execute(contato) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validações de domínio poderiam ser adicionadas aqui
                // Por exemplo, verificar se o telefone tem o formato correto, etc.
                // Salvar o contato no repositório
                const savedContato = yield this.contatoRepository.save(contato);
                return savedContato;
            }
            catch (error) {
                console.error(`Erro ao criar contato: ${error}`);
                throw error;
            }
        });
    }
}
exports.CreateContatoUseCase = CreateContatoUseCase;

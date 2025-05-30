"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContatoDTO = void 0;
/**
 * @author Lieberte Ferreira <liebertt7@gmail.com>
 * @date 2025-05-10
 * Define o Data Transfer Object (DTO) para a criação e validação de Contatos.
 */
const class_validator_1 = require("class-validator");
class ContatoDTO {
}
exports.ContatoDTO = ContatoDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "O ID do usuário é obrigatório" }),
    __metadata("design:type", Number)
], ContatoDTO.prototype, "Id_usuario", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "O telefone celular é obrigatório" }),
    (0, class_validator_1.IsString)({ message: "O telefone celular deve ser uma string" }),
    (0, class_validator_1.Length)(9, 9, { message: "O telefone celular deve ter exatamente 9 caracteres" }),
    __metadata("design:type", String)
], ContatoDTO.prototype, "Telefone_celular", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "O telefone recado deve ser uma string" }),
    (0, class_validator_1.Length)(9, 9, { message: "O telefone recado deve ter exatamente 9 caracteres" }),
    __metadata("design:type", String)
], ContatoDTO.prototype, "Telefone_recado", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "O email é obrigatório" }),
    (0, class_validator_1.IsEmail)({}, { message: "O email deve ser um endereço de email válido" }),
    (0, class_validator_1.Length)(1, 50, { message: "O email deve ter no máximo 50 caracteres" }),
    __metadata("design:type", String)
], ContatoDTO.prototype, "Email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "O endereço é obrigatório" }),
    (0, class_validator_1.IsString)({ message: "O endereço deve ser uma string" }),
    (0, class_validator_1.Length)(1, 100, { message: "O endereço deve ter no máximo 100 caracteres" }),
    __metadata("design:type", String)
], ContatoDTO.prototype, "Endereco", void 0);

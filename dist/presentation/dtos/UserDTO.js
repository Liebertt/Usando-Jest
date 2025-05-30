"use strict";
// DDD ==> Domain Driven Development
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
exports.UserDTO = void 0;
const class_validator_1 = require("class-validator");
class UserDTO {
    constructor(_name, _email) {
        this.name = _name;
        this.email = _email;
    }
}
exports.UserDTO = UserDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "O nome é obrigatório." }),
    (0, class_validator_1.Length)(5, 70, { message: "O nome deve conter entre 5 e 70 caracteres." }),
    __metadata("design:type", String)
], UserDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "O e-mail informado é invalido." }),
    (0, class_validator_1.IsNotEmpty)({ message: "O e-mail é um campo obrigatório." }),
    __metadata("design:type", String)
], UserDTO.prototype, "email", void 0);

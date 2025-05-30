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
/**
 * @author Lieberte Ferreira <liebertt7@gmail.com>
 * @date 2025-05-10
 * Define as rotas da API para as operações de Contato.
 */
const express_1 = require("express");
const ContatoController_1 = require("../controllers/ContatoController");
const contatoRoutes = (0, express_1.Router)();
const contatoController = new ContatoController_1.ContatoController();
// Rota para criar um novo contato
contatoRoutes.post("/contatos", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield contatoController.create(req, res);
    }
    catch (error) {
        next(error);
    }
}));
// Rota para buscar contatos por ID do usuário
contatoRoutes.get("/contatos/usuario/:userId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield contatoController.getByUserId(req, res);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = contatoRoutes;

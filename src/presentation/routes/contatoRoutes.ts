/**
 * @author Lieberte Ferreira <liebertt7@gmail.com>
 * @date 2025-05-10
 * Define as rotas da API para as operações de Contato.
 */
import { Router, Request, Response, NextFunction } from "express";
import { ContatoController } from "../controllers/ContatoController";

const contatoRoutes = Router();

// Função para criar o controller de forma lazy (apenas quando necessário)
function getContatoController(): ContatoController {
    return new ContatoController();
}

// Rota para criar um novo contato
contatoRoutes.post("/contatos", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contatoController = getContatoController();
        await contatoController.create(req, res);
    } catch (error) {
        next(error);
    }
});

// Rota para buscar contatos por ID do usuário
contatoRoutes.get("/contatos/usuario/:userId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contatoController = getContatoController();
        await contatoController.getByUserId(req, res);
    } catch (error) {
        next(error);
    }
});

export default contatoRoutes;
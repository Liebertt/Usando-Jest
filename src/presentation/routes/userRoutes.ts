import { Router } from "express";
import { UserController } from "@presentation/controllers/UserController";
import { validateDTO } from "@presentation/controllers/middlewares/validateDTO";
import { UserDTO } from "@presentation/dtos/UserDTO";

const router = Router();

// Função para criar o controller de forma lazy (apenas quando necessário)
function getUserController(): UserController {
    return new UserController();
}

router.post("/users", validateDTO(UserDTO), async(req, res, next) => {
    try {
        const userController = getUserController();
        await userController.createUser(req, res);
    } catch (error) {
        next(error);
    }
});

router.get("/users", async(req, res, next) => {
    try {
        const userController = getUserController();
        await userController.getAllUsers(req, res);
    } catch (error) {
        next(error);
    }
});

router.get("/users/:email", async(req, res, next) => {
    try {
        const userController = getUserController();
        await userController.getUserByEmail(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;
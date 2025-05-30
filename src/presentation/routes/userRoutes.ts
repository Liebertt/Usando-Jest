import { Router } from "express";
import { UserController } from "@presentation/controllers/UserController";
import { validateDTO } from "@presentation/controllers/middlewares/validateDTO";
import { UserDTO } from "@presentation/dtos/UserDTO";


const router = Router();
const userController = new UserController();

// router.get("/users", (req, res) => { res.send("User rotes") });

router.post("/users",validateDTO(UserDTO), async(req, res, next) => {
    try {
        await userController.createUser(req, res);
    } catch (error) {
        next(error);
    }
} );

router.get("/users", async(req, res, next) => {
    try {
        await userController.getAllUsers(req, res);
    } catch (error) {
        next(error);
    }
} );

router.get("/users/:email", async(req, res, next) => {
    try {
        await userController.getUserByEmail(req, res);
    } catch (error) {
        next(error);
    }
} );

// router.get("/users/:name", async(req, res, next) => {
//     try {
//         await userController.getAllUsers(req, res);
//     } catch (error) {
//         next(error);
//     }
// } );

export default router;
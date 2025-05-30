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
const express_1 = require("express");
const UserController_1 = require("@presentation/controllers/UserController");
const validateDTO_1 = require("@presentation/controllers/middlewares/validateDTO");
const UserDTO_1 = require("@presentation/dtos/UserDTO");
const router = (0, express_1.Router)();
const userController = new UserController_1.UserController();
// router.get("/users", (req, res) => { res.send("User rotes") });
router.post("/users", (0, validateDTO_1.validateDTO)(UserDTO_1.UserDTO), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.createUser(req, res);
    }
    catch (error) {
        next(error);
    }
}));
router.get("/users", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.getAllUsers(req, res);
    }
    catch (error) {
        next(error);
    }
}));
router.get("/users/:email", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.getUserByEmail(req, res);
    }
    catch (error) {
        next(error);
    }
}));
// router.get("/users/:name", async(req, res, next) => {
//     try {
//         await userController.getAllUsers(req, res);
//     } catch (error) {
//         next(error);
//     }
// } );
exports.default = router;

import { Router } from "express";
import userController from "./user.controller.js";
import auth from "../auth/auth.controller.js";

const userRouter = Router();

userRouter.get("/",auth.authorize, userController.getUserData);
// userRouter.post("/edit", userController.updateUserData);
// userRouter.post("/login",userController.login);

export default userRouter;

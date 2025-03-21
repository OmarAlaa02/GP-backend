import { Router } from "express";
import questionController from "./question.controller.js";
import auth from "../auth/auth.controller.js";
const questionRouter = Router();

questionRouter.get("/", auth.authorize, questionController.getQuestions);

export default questionRouter;

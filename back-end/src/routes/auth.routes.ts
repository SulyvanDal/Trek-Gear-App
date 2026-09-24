import { Router } from "express";
import { validateBody } from "../middlewares/validate.ts";
import { loginSchema, registerSchema } from "../schema/auth.schema.ts";
import { register, login } from "../controllers/auth.controller.ts";

const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register)
authRouter.post("/login",validateBody(loginSchema), login);

export default authRouter;
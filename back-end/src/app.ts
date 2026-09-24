import express from "express";
import apiRouter from "./routes/index.ts";
import { errorHandler } from "./middlewares/error-handler.ts";
import cors from "cors";
import { currentUser } from "./middlewares/currentUser.ts";
import authRouter from "./routes/auth.routes.ts";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/auth",authRouter)
app.use("/api",currentUser, apiRouter);
app.use(errorHandler);

export default app;

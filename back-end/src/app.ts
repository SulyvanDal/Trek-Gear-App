import express from "express";
import apiRouter from "./routes/index.ts";
import { errorHandler } from "./middlewares/error-handler.ts";
import cors from "cors";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api", apiRouter);
app.use(errorHandler);

export default app;

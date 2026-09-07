import { Router } from "express";
import routerItem from "./item.routes.ts";
import routerBag from "./bag.routes.ts";

const apiRouter = Router();

apiRouter.use("/items", routerItem);
apiRouter.use("/bags", routerBag);

export default apiRouter;

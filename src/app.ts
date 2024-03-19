import express, { Application, Request, Response } from "express";

import cosrs from "cors";
import { userRoutes } from "./app/modules/User/user.routes";

const app: Application = express();
express;
// middlewares
app.use(cosrs());
// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({ server: "server is running" });
});

app.use("/api/v1/user", userRoutes);

export default app;
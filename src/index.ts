import "reflect-metadata";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { loadEnv } from "./env";
import { log } from "./log";
import { postsRouter } from "./routes";

loadEnv();
const apiPort = process.env["API_PORT"];
const app = express();

app.get("/", handleHome);
app.use(cookieParser());
app.use("/posts", postsRouter);

app.listen(apiPort, () => log(`app listening on ${apiPort}`));

async function handleHome(req: Request, res: Response) {
    log(`${req.method} ${req.path}`);
    res.status(200).json({ message: "welcome" });
}

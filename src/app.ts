import cookieParser from "cookie-parser";
import express from "express";
import { apiRoot } from "./constants";
import { log } from "./log";
import { homeRouter, postsRouter } from "./routes";

export function runApp() {
    const apiPort = process.env["API_PORT"];
    const app = express();

    app.use(cookieParser());
    app.use(apiRoot, homeRouter);
    app.use(`${apiRoot}posts`, postsRouter);

    app.listen(apiPort, () => log(`app listening on ${apiPort}`));
}

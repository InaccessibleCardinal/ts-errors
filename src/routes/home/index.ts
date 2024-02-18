import { Request, Response, Router } from "express";
import { log } from "../../log";

export const homeRouter = Router();

homeRouter.get("/", handleHome);

async function handleHome(req: Request, res: Response) {
    log(`${req.method} ${req.path}`);
    res.status(200).json({ message: "welcome" });
}

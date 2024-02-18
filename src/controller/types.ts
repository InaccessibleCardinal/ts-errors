import { Request, Response } from "express";

export type RequestHandlerFunc = (req: Request, res: Response) => Promise<void>;

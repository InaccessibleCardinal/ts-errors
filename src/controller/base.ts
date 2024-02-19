import { Response } from "express";
import { HttpStatus } from "./types";

export abstract class ControllerBase {
    protected Ok<T extends object>(res: Response, value: T): void {
        res.status(HttpStatus.OK).json(value);
    }

    protected Created<T extends object>(res: Response, value: T): void {
        res.status(HttpStatus.CREATED).json(value);
    }

    protected ServerError(res: Response, message: string) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
}

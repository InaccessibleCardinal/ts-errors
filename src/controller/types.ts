import { Request, Response } from "express";

export type RequestHandlerFunc = (req: Request, res: Response) => Promise<void>;

export type HttpStatusCode = 200 | 201 | 400 | 401 | 403 | 500;

export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500,
} as const;

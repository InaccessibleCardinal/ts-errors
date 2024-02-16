import { ErrorConfig, ErrorNames, StatusCode } from "./types";

export class AppError extends Error {
    override name: string;
    cause: unknown;
    statusCode: StatusCode | undefined;
    constructor({cause, message, name, statusCode}: ErrorConfig) {
        super();
        this.message = message;
        this.name = name;
        this.cause = cause?? "";
        this.statusCode = statusCode ?? this.setStatus(name);
    }
    private setStatus(name: string) {
        switch (name) {
            case ErrorNames.BAD_REQUEST_ERROR:
                return 400; 
            case ErrorNames.FORBIDDEN_ERROR:
                return 403;
            case ErrorNames.UNAUTHORIZED_ERROR:
                return 401;
            case ErrorNames.VALIDATION_ERROR:
                return 400;
            default:
                return 500;
        }
    }
}
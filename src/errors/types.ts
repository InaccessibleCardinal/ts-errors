export type StatusCode = 400 | 401 | 403 | 500;

export enum ErrorNames {
    APP_ERROR = "AppError",
    BAD_REQUEST_ERROR = "BadRequestError",
    UNAUTHORIZED_ERROR = "UnauthorizedError",
    FORBIDDEN_ERROR = "ForbiddenError",
    VALIDATION_ERROR = "ValidationError"
}

export type ErrorName = ErrorNames.APP_ERROR | ErrorNames.BAD_REQUEST_ERROR | ErrorNames.FORBIDDEN_ERROR | ErrorNames.UNAUTHORIZED_ERROR | ErrorNames.VALIDATION_ERROR;

export interface ErrorConfig {
    cause?: unknown;
    message: string;
    name: ErrorName;
    statusCode?: StatusCode
}
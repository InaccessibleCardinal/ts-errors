import { AppError } from "./app-error";
import { ErrorNames } from "./types";

describe('AppError', () => {
    it("should create an app error", () => {
        const err = new AppError({name: ErrorNames.APP_ERROR, message: "test error"});
        expect(err.name).toBe("AppError");
        expect(err.message).toBe("test error");
        expect(err.statusCode).toBe(500);
    });

    it("should create an unauthorized error", () => {
        const downStreamErr = new Error('fail');
        const err = new AppError({
            name: ErrorNames.UNAUTHORIZED_ERROR,
            message: "no token",
            statusCode: 401,
            cause: downStreamErr,
        });
        expect(err.name).toBe("UnauthorizedError");
        expect(err.statusCode).toBe(401);
        expect(err.message).toBe("no token");
        expect(err.cause).toStrictEqual(downStreamErr);
    });

    it("should create an forbidden error", () => {
        const downStreamErr = new Error('bad');
        const err = new AppError({
            name: ErrorNames.FORBIDDEN_ERROR,
            message: "wrong token",
            cause: downStreamErr,
        });
        expect(err.name).toBe("ForbiddenError");
        expect(err.statusCode).toBe(403);
        expect(err.message).toBe("wrong token");
    });
});
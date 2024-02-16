import { AppError, ErrorNames } from "./errors";
import { log } from "./log";


(async () => {
    const err = new Error('downstream failure');
    const forbiddenError = new AppError({name: ErrorNames.FORBIDDEN_ERROR, message: "no permissions", cause: err});
    log(forbiddenError);

    const valError = new AppError({name: ErrorNames.VALIDATION_ERROR, message: "invalid things", cause: err});

    log(valError);
})();

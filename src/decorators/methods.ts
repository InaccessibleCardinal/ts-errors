import { Request, Response } from "express";

export function Get(path: string) {
    return function (target: object, _propertyKey: string | symbol, _descriptor: TypedPropertyDescriptor<any>) {
        Reflect.defineMetadata("apiPath", path, target);
        Reflect.defineMetadata("apiMethod", "GET", target);
    };
}

export function Protected() {
    return function (_target: object, _propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        const originalMethod = descriptor.value!;

        descriptor.value = async function (req: Request, res: Response) {
            if (!checkAuth(req)) {
                res.status(401).send("Unauthorized");
                return;
            }
            return await originalMethod.call(this, req, res);
        };
    };
}

function checkAuth({ headers }: Request) {
    if (!headers["authorization"]) {
        return false;
    }
    return true;
}

export function HasEpicCookie() {
    return function (_target: object, _propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        const originalMethod = descriptor.value!;

        descriptor.value = async function (req: Request, res: Response) {
            const cookies = req.cookies;
            if (!cookies["EpicCookie"]) {
                res.status(403).send("you can't do this because you're not epic");
                return;
            }
            return await originalMethod.call(this, req, res);
        };
    };
}

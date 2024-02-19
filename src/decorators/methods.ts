import { Request, Response } from "express";
import { log } from "../log";
import { HttpStatusCode, RequestHandlerFunc } from "../controller";
import { Post } from "../models";

type MiddlewareDecoratorFunction = () => (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
) => void;

export function Get(path: string) {
    return function (target: object, propertyKey: string | symbol, _descriptor: TypedPropertyDescriptor<any>) {
        Reflect.defineMetadata("apiPath", path, target, propertyKey);
        Reflect.defineMetadata("apiMethod", "GET", target, propertyKey);
    };
}

export function Post(path: string) {
    return function (target: object, propertyKey: string | symbol, _descriptor: TypedPropertyDescriptor<any>) {
        Reflect.defineMetadata("apiPath", path, target, propertyKey);
        Reflect.defineMetadata("apiMethod", "POST", target, propertyKey);
    };
}

export function Returns(...statuses: HttpStatusCode[]) {
    return function (target: object, propertyKey: string | symbol, _descriptor: TypedPropertyDescriptor<any>) {
        Reflect.defineMetadata("returns", statuses, target, propertyKey);
    };
}

export function Logging() {
    return function (
        _target: object,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<RequestHandlerFunc>
    ) {
        const originalMethod = descriptor.value!;
        descriptor.value = async function (req: Request, res: Response) {
            log(`${req.method} ${req.path} handled by ${String(propertyKey)}`);
            return await originalMethod.call(this, req, res);
        };
        return descriptor;
    };
}

export function Header() {
    return function (
        _target: object,
        _propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<RequestHandlerFunc>
    ) {
        const originalMethod = descriptor.value!;

        descriptor.value = async function (req: Request, res: Response) {
            res.setHeader("Special", "K");
            log("set random header data");
            return await originalMethod.call(this, req, res);
        };
        return descriptor;
    };
}

export function Protected() {
    return function (
        _target: object,
        _propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<RequestHandlerFunc>
    ) {
        const originalMethod = descriptor.value!;

        descriptor.value = async function (req: Request, res: Response) {
            if (!checkAuth(req)) {
                res.status(401).send("Unauthorized");
                return;
            }
            log("auth header verified");
            return await originalMethod.call(this, req, res);
        };
        return descriptor;
    };
}

function checkAuth({ headers }: Request) {
    if (!headers["authorization"]) {
        return false;
    }
    return true;
}

export function HasEpicCookie() {
    return function (
        _target: object,
        _propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<RequestHandlerFunc>
    ) {
        const originalMethod = descriptor.value!;

        descriptor.value = async function (req: Request, res: Response) {
            const cookies = req.cookies;
            if (!cookies["EpicCookie"]) {
                res.status(403).send("you can't do this because you're not epic");
                return;
            }
            log("epic cookie verified");
            return await originalMethod.call(this, req, res);
        };
        return descriptor;
    };
}

export function ApplyMiddleware(...middleware: MiddlewareDecoratorFunction[]) {
    return function (
        target: object,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<RequestHandlerFunc>
    ) {
        for (const mw of middleware) {
            mw()(target, propertyKey, descriptor);
        }
    };
}

export function ValidatePost() {
    return function (
        _target: object,
        _propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<RequestHandlerFunc>
    ) {
        const originalMethod = descriptor.value!;

        descriptor.value = async function (req: Request, res: Response) {
            const { body } = req;
            if (!checkIsPostBodyValid(body)) {
                res.status(400).json({ message: "bad request" });
                log(`post is invalid:`, body);
                return;
            }
            log("post shape verified");
            return await originalMethod.call(this, req, res);
        };
        return descriptor;
    };
}

function checkIsPostBodyValid(post: Partial<Post>) {
    return !post.body || !post.id || !post.title || !post.userId ? false : true;
}

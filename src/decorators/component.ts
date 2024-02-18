export function Controller(path: string) {
    return function (target: object) {
        Reflect.defineMetadata("route", path, target);
    };
}

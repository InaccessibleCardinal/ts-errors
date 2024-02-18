import "reflect-metadata";

export interface Newable<T> {
    new (...args: any[]): T;
}

export class Container {
    static containerMap = new Map<string, any>();

    static autowire = <T>(target: Newable<T>) => {
        if (Container.containerMap.has(target.name)) {
            return Container.containerMap.get(target.name);
        }
        const dependencyArgs = Reflect.getMetadata("design:paramtypes", target) || [];
        const concretions = dependencyArgs.map((_arg: any, index: number) =>
            Reflect.getMetadata(getDependencyId(index), target)
        );
        const injections = concretions.map((dep: Newable<any>) => {
            return Container.autowire(dep);
        });

        const instance = new target(...injections);
        Container.containerMap.set(target.name, instance);
        return instance;
    };
}

export function Injectable() {
    return function <T>(target: Newable<T>) {
        Reflect.defineMetadata("injectableClass", true, target);
    };
}

export function Inject(concretion: any) {
    return function (target: object, _propertyKey: any, parameterIndex: number) {
        Reflect.defineMetadata(getDependencyId(parameterIndex), concretion, target);
    };
}

function getDependencyId(i: number) {
    return `dependency_${i}`;
}

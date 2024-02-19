import "reflect-metadata";
import { Ctrl } from "./controller";
import { ControllerBase } from "./controller/base";
import { log } from "./log";

(() => {
    const proto = Ctrl.prototype;
    Reflect.ownKeys(proto).forEach((key) => {
        log("key: ", key);
        const protoValue = (proto as any)[key];
        if (typeof protoValue === "function") {
            const funcMetadata = Reflect.getMetadata("apiPath", ControllerBase, key);
            log("key: ", key, "funcMetadata: ", funcMetadata);
        }
    });
})();

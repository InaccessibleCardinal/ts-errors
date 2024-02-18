import { Router } from "express";
import { Container } from "../../di";
import { Ctrl } from "../../controller";

const controller: Ctrl = Container.autowire(Ctrl);

export const postsRouter = Router({ mergeParams: true });

postsRouter.get("/", controller.getPosts);

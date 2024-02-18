import { Request, Response } from "express";
import { Inject } from "../../di";
import { Post } from "../../models";
import { Web, WebServiceIface } from "../../service/web";
import { Get, HasEpicCookie, Protected } from "../../decorators";
import { Controller } from "../../decorators/component";

@Controller("/posts")
export class Ctrl {
    constructor(@Inject(Web) private svc: WebServiceIface<Post>) {
        this.svc = svc;
        this.getPosts = this.getPosts.bind(this);
    }
    @Get("/")
    @HasEpicCookie()
    @Protected()
    public async getPosts(_req: Request, res: Response) {
        const posts = await this.svc.getAll();
        res.status(200).json(posts);
    }
}

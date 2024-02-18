import { Request, Response } from "express";
import { Inject } from "../../di";
import { Post as PostShape } from "../../models";
import { Web, WebServiceIface } from "../../service/web";
import { ApplyMiddleware, Get, HasEpicCookie, Header, Logging, Post, Protected, ValidatePost } from "../../decorators";
import { Controller } from "../../decorators/component";

@Controller("/posts")
export class Ctrl {
    constructor(@Inject(Web) private svc: WebServiceIface<PostShape>) {
        this.svc = svc;
        this.getPosts = this.getPosts.bind(this);
        this.addPost = this.addPost.bind(this);
    }
    @Get("/")
    // @Header()
    // @HasEpicCookie()
    // @Protected()
    // @Logging()
    @ApplyMiddleware(Logging, Protected, HasEpicCookie, Header)
    public async getPosts(_req: Request, res: Response) {
        const posts = await this.svc.getAll();
        res.status(200).json(posts);
    }

    @Post("/")
    @HasEpicCookie()
    @ValidatePost()
    public async addPost(req: Request, res: Response) {
        const isSuccess = await this.svc.addPost(req.body);
        if (isSuccess) {
            res.status(201).json({ message: "created", post: req.body });
            return;
        }
        res.status(500).json({ message: "the fake db is whack" });
    }
}

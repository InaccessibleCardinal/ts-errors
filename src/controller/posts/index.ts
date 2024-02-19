import { Request, Response } from "express";
import { Inject } from "../../di";
import { Post as PostShape } from "../../models";
import { Web, WebServiceIface } from "../../service/web";
import {
    ApplyMiddleware,
    Get,
    HasEpicCookie,
    Header,
    Logging,
    Post,
    Protected,
    Returns,
    ValidatePost,
} from "../../decorators";
import { Controller } from "../../decorators/component";
import { ControllerBase } from "../base";
import { HttpStatus } from "../types";

@Controller("/posts")
export class Ctrl extends ControllerBase {
    constructor(@Inject(Web) private svc: WebServiceIface<PostShape>) {
        super();
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
    @Returns(HttpStatus.OK)
    public async getPosts(_req: Request, res: Response) {
        const posts = await this.svc.getAll();
        this.Ok(res, posts);
    }

    @Post("/")
    @HasEpicCookie()
    @ValidatePost()
    @Returns(HttpStatus.CREATED, HttpStatus.BAD_REQUEST, HttpStatus.FORBIDDEN, HttpStatus.INTERNAL_SERVER_ERROR)
    public async addPost(req: Request, res: Response) {
        const isSuccess = await this.svc.addPost(req.body);
        if (isSuccess) {
            this.Created(res, { message: "created", post: req.body });
            return;
        }
        this.ServerError(res, "the fake db is whack");
    }
}

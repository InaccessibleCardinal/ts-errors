import { writeFileSync } from "fs";
import { log } from "../log";
import { Post } from "../models";

export interface DBIface {
    upsert: (post: Post) => Promise<boolean>;
    select: () => Promise<Post[]>;
}

export class DB implements DBIface {
    async upsert(post: Post) {
        try {
            writeFileSync(post.title, JSON.stringify(post, null, 2));
            return true;
        } catch (err) {
            log(err);
            return false;
        }
    }
    async select() {
        try {
            return await fetch(process.env["POSTS"]!).then((r) => r.json());
        } catch (err) {
            log(err);
            return [];
        }
    }
}

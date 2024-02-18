import { DB, DBIface } from "../../db";
import { Inject } from "../../di";
import { Post } from "../../models";

export interface WebServiceIface<T> {
    getAll: () => Promise<T[]>;
}

export class Web implements WebServiceIface<Post> {
    constructor(@Inject(DB) private db: DBIface) {}
    async getAll() {
        return await this.db.select();
    }
}

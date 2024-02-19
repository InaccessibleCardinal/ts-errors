import { Request, Response } from "express";
import { Ctrl } from ".";
import { Post } from "../../models";
import { WebServiceIface } from "../../service";

const mockPosts = [{ id: 1, userId: 1, title: "test title", body: "test body" }];
class MockWebSvc implements WebServiceIface<Post> {
    async getAll() {
        return mockPosts;
    }
    async addPost(post: Post) {
        if (post.id === 1) {
            return false;
        }
        return true;
    }
}

describe("Ctrl class", () => {
    it("Should handle a request and get posts", async () => {
        const ctrl = new Ctrl(new MockWebSvc());
        const mockReq = {
            method: "GET",
            path: "/",
            cookies: { EpicCookie: "yes" },
            headers: { authorization: "yes" },
        } as unknown as Request;
        const mockJson = { json: jest.fn() };
        const mockRes = {
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue(mockJson),
        } as unknown as Response;
        await ctrl.getPosts(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockJson.json).toHaveBeenCalledWith(mockPosts);
    });

    it("Should invoke addPost and respond with 201 CREATED", async () => {
        const ctrl = new Ctrl(new MockWebSvc());
        const goodPost = { id: 2, userId: 1, body: "testbody", title: "testtitle" };
        const mockReq = { cookies: { EpicCookie: "yes" }, body: goodPost } as unknown as Request;
        const mockJson = { json: jest.fn() };
        const mockRes = {
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue(mockJson),
        } as unknown as Response;

        await ctrl.addPost(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("Should invoke addPost and respond with 400 BAD REQUEST", async () => {
        const ctrl = new Ctrl(new MockWebSvc());
        const badPost = { id: 2, userId: 1, title: "testtitle" };
        const mockReq = { cookies: { EpicCookie: "yes" }, body: badPost } as unknown as Request;
        const mockJson = { json: jest.fn() };
        const mockRes = {
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue(mockJson),
        } as unknown as Response;

        await ctrl.addPost(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("Should invoke addPost and respond with 403 FORBIDDEN", async () => {
        const ctrl = new Ctrl(new MockWebSvc());
        const okPost = { id: 2, userId: 1, body: "...", title: "testtitle" };
        const mockReq = { cookies: { EpicCookieBad: "yes" }, body: okPost } as unknown as Request;
        const mockJson = { send: jest.fn() };
        const mockRes = {
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue(mockJson),
        } as unknown as Response;

        await ctrl.addPost(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(403);
    });
});

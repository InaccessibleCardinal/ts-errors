import { Request, Response } from "express";
import { Ctrl } from ".";
import { Post } from "../../models";
import { WebServiceIface } from "../../service";

const mockPosts = [{ id: 1, userId: 1, title: "test title", body: "test body" }];
class MockWebSvc implements WebServiceIface<Post> {
    async getAll() {
        return mockPosts;
    }
}

describe("Ctrl class", () => {
    it("Should handle a request and get posts", async () => {
        const ctrl = new Ctrl(new MockWebSvc());
        const mockReq = { cookies: { EpicCookie: "yes" }, headers: { authorization: "yes" } } as unknown as Request;
        const mockJson = { json: jest.fn() };
        const mockRes = {
            status: jest.fn().mockReturnValue(mockJson),
        } as unknown as Response;
        await ctrl.getPosts(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockJson.json).toHaveBeenCalledWith(mockPosts);
    });
});

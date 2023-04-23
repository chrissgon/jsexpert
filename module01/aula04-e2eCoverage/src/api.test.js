const { describe, it, after, before } = require("mocha");
const supertest = require("supertest");
const assert = require("assert");

const DEFAULT_USER = {
  nickname: "chrissgon",
  password: 123456,
};

describe("API Suite Test", () => {
  let app;

  before((done) => {
    app = require("./api");
    app.once("listening", done);
  });

  after((done) => app.close(done));

  describe("/default", () => {
    it("should request none route and return HTTP 404", async () => {
      await supertest(app).get("/none").expect(404);
    });
  });

  describe("/user:get", () => {
    it("should request /user:get route and return HTTP 200", async () => {
      const response = await supertest(app).get("/user").expect(200);

      const expected = JSON.stringify(DEFAULT_USER);
      const result = response.text;

      assert.deepStrictEqual(result, expected);
    });
  });

  describe("/login:post", () => {
    it("should request /login:post route and return HTTP 200", async () => {
      await supertest(app).post("/login").send(DEFAULT_USER).expect(200);
    });
    it("should request /login:post route and return HTTP 401", async () => {
      await supertest(app).post("/login").send({}).expect(401);
    });
  });
});

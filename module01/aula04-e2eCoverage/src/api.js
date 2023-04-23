const http = require("http");
const { once } = require("events");

const DEFAULT_USER = {
  nickname: "chrissgon",
  password: 123456,
};

const routes = {
  default: (_, response) => {
    response.writeHead(404);
    return response.end("not found");
  },
  "/user:get": (_, response) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    return response.end(JSON.stringify(DEFAULT_USER));
  },
  "/login:post": async (request, response) => {
    const user = JSON.parse(await once(request, "data"));

    if (
      user.nickname !== DEFAULT_USER.nickname ||
      user.password !== DEFAULT_USER.password
    ) {
      response.writeHead(401);
      return response.end();
    }

    response.writeHead(200);
    return response.end();
  },
};

const handler = (request, response) => {
  const { url, method } = request;

  const routeKey = `${url.toLowerCase()}:${method.toLowerCase()}`;

  const chosen = routes[routeKey] || routes.default;

  return chosen(request, response);
};

const app = http
  .createServer(handler)
  .listen(3000, () => console.log("running at 3000"));

module.exports = app;

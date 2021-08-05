const fastify = require("fastify")({
  logger: true,
});

fastify.register(require("point-of-view"), {
  engine: {
    nunjucks: require("nunjucks"),
  },
});

fastify.get("/", (req, reply) => {
  reply.view("/templates/index.njk", { title: "title" });
});

fastify.listen(3000, (err) => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});

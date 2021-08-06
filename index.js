const fastify = require("fastify")({
  logger: true,
});
const marked = require("marked");
const fs = require("fs");
const path = require("path");

marked.setOptions({
  gfm: true,
});

fastify.register(require("point-of-view"), {
  engine: {
    nunjucks: require("nunjucks"),
  },
});

fastify.get("/", (req, reply) => {
  reply.view("/templates/index.njk", { title: "title" });
});

fastify.get("/:post", (req, reply) => {
  console.time("Render " + req.params.post);
  console.log("Requested: " + req.params.post + " at " + Date.now());

  let file = __dirname + "/post/" + req.params.post + ".md";

  fs.readFile(file, "utf-8", (err, contents) => {
    if (err) throw err;
    reply.send(marked(contents));
  });

  console.timeEnd("Render " + req.params.post);
});

fastify.listen(3000, (err) => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});

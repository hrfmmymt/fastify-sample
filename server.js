const fastify = require("fastify")({ logger: true });

fastify.get("/", async (request, reply) => {
  reply.send({ hello: "world" });
});

fastify.listen(3000, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});

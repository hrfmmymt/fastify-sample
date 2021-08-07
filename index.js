const fs = require("fs");
const path = require("path");

const fastify = require("fastify")({
  logger: true,
  ignoreTrailingSlash: true,
});
const marked = require("marked");

const config = {
  mdDir: path.join(__dirname, "/post/"),
};

marked.setOptions({
  gfm: true,
});

function getPostInfo(mdName, withHtml) {
  return new Promise((resolve, reject) => {
    fs.readFile(config.mdDir + mdName, "utf-8", (err, md) => {
      if (err) {
        return reject(err);
      }
      const postTitle = md.match(/^#\s(.)+\n/)[0].match(/[^#\n\s]+/);
      const postDescription = md.match(/\n>(.)+\n/)[0].match(/[^>\n\s]+/);
      marked.setOptions({
        gfm: true,
      });
      resolve({
        title: postTitle[0],
        description: postDescription[0],
        url: mdName,
        html: withHtml ? marked(md) : null,
      });
    });
  });
}

const schema = {
  querystring: {
    name: { type: "string" },
    excitement: { type: "integer" },
  },
  response: {
    200: {
      type: "object",
      properties: {
        title: { type: "string" },
      },
    },
  },
};

fastify.register(require("point-of-view"), {
  engine: {
    nunjucks: require("nunjucks"),
  },
});

fastify.get("/", { schema }, (_req, reply) => {
  return new Promise((resolve, reject) => {
    fs.readdir(config.mdDir, (err, mdFiles) => {
      if (err) throw err;
      const postsInfo = [];
      mdFiles.forEach((_, i) => {
        getPostInfo(mdFiles[i], false).then((postInfo) => {
          postsInfo.push(postInfo);
          if (i === mdFiles.length - 1) {
            reply.view("./templates/index.njk", {
              head: {
                title: "headTtl",
                url: "",
                description: "",
              },
              postList: postsInfo,
            });
          }
        });
      });
    });
  });
});

fastify.get("/:post", (req, reply) => {
  const file = path.format({
    name: req.params.post,
    ext: ".md",
  });

  getPostInfo(file, true).then((postInfo) => {
    reply.view("./templates/post.njk", {
      postList: false,
      head: {
        title: postInfo.title,
        url: postInfo.url,
        description: postInfo.description,
        fbimg: "hoge.jpg",
        twimg: "hoge.jpg",
        twaccount: "@hogehoge",
      },
      post: {
        contents: postInfo.html,
      },
    });
  });
});

fastify.listen(3000, (err) => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});
